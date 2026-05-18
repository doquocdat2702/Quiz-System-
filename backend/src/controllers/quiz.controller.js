const { getPool } = require("../config/database");

async function getAllQuizzes(_req, res, next) {
  try {
    const pool = getPool();
    const [quizzes] = await pool.query(
      "SELECT id, title, description, created_at FROM quizzes ORDER BY id ASC"
    );
    res.json({ success: true, data: { quizzes } });
  } catch (err) {
    next(err);
  }
}

async function getQuizById(req, res, next) {
  try {
    const pool = getPool();
    const [[quiz]] = await pool.query(
      "SELECT id, title, description, created_at FROM quizzes WHERE id = ?",
      [req.params.id]
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz không tồn tại" });
    }

    const [questions] = await pool.query(
      "SELECT id, question, answers FROM questions WHERE quiz_id = ? ORDER BY id ASC",
      [quiz.id]
    );

    // answers đã là JSON object vì mysql2 tự parse JSON columns
    const parsedQuestions = questions.map((q) => ({
      ...q,
      answers: typeof q.answers === "string" ? JSON.parse(q.answers) : q.answers,
    }));

    res.json({ success: true, data: { quiz: { ...quiz, questions: parsedQuestions } } });
  } catch (err) {
    next(err);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const pool = getPool();
    const quizId = Number(req.params.id);
    const { answers } = req.body; // { [questionId]: selectedIndex }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Dữ liệu câu trả lời không hợp lệ" });
    }

    const [[quiz]] = await pool.query("SELECT id FROM quizzes WHERE id = ?", [quizId]);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz không tồn tại" });
    }

    const [questions] = await pool.query(
      "SELECT id, correct FROM questions WHERE quiz_id = ?",
      [quizId]
    );

    const total = questions.length;
    let score = 0;
    const details = questions.map((q) => {
      const selected = answers[q.id];
      const isCorrect = Number(selected) === q.correct;
      if (isCorrect) score++;
      return { questionId: q.id, selected, correct: q.correct, isCorrect };
    });

    await pool.query(
      "INSERT INTO quiz_attempts (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)",
      [req.user.id, quizId, score, total]
    );

    console.log(`[QUIZ] User ${req.user.email} hoàn thành quiz ${quizId}: ${score}/${total}`);
    res.json({ success: true, data: { score, total, details } });
  } catch (err) {
    next(err);
  }
}

async function createQuiz(req, res, next) {
  try {
    const { title, description, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin quiz hoặc câu hỏi" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [quizResult] = await conn.query(
        "INSERT INTO quizzes (title, description) VALUES (?, ?)",
        [title, description || ""]
      );
      const quizId = quizResult.insertId;

      for (const q of questions) {
        if (!q.question || !Array.isArray(q.answers) || q.correct === undefined) {
          throw Object.assign(new Error("Dữ liệu câu hỏi không hợp lệ"), { status: 400 });
        }
        await conn.query(
          "INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)",
          [quizId, q.question, JSON.stringify(q.answers), q.correct]
        );
      }

      await conn.commit();

      const [[newQuiz]] = await pool.query(
        "SELECT id, title, description, created_at FROM quizzes WHERE id = ?",
        [quizId]
      );

      console.log(`[QUIZ] Admin tạo quiz mới: "${title}" (id: ${quizId})`);
      res.status(201).json({ success: true, message: "Tạo quiz thành công", data: { quiz: newQuiz } });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllQuizzes, getQuizById, submitQuiz, createQuiz };
