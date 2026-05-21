const { getPool } = require("../config/database");

async function getAllQuizzes(_req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, title, description, created_at FROM quizzes ORDER BY id ASC"
    );

    res.json({ success: true, data: { quizzes: result.rows } });
  } catch (err) {
    next(err);
  }
}

async function getQuizById(req, res, next) {
  try {
    const pool = getPool();
    const quizResult = await pool.query(
      "SELECT id, title, description, created_at FROM quizzes WHERE id = $1",
      [req.params.id]
    );
    const quiz = quizResult.rows[0];

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz khong ton tai" });
    }

    const questionsResult = await pool.query(
      "SELECT id, question, answers FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
      [quiz.id]
    );

    const questions = questionsResult.rows.map((q) => ({
      ...q,
      answers: typeof q.answers === "string" ? JSON.parse(q.answers) : q.answers,
    }));

    res.json({ success: true, data: { quiz: { ...quiz, questions } } });
  } catch (err) {
    next(err);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const pool = getPool();
    const quizId = Number(req.params.id);
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Du lieu cau tra loi khong hop le" });
    }

    const quizResult = await pool.query("SELECT id FROM quizzes WHERE id = $1", [quizId]);
    const quiz = quizResult.rows[0];
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz khong ton tai" });
    }

    const questionsResult = await pool.query(
      "SELECT id, correct FROM questions WHERE quiz_id = $1",
      [quizId]
    );
    const questions = questionsResult.rows;

    const total = questions.length;
    let score = 0;
    const details = questions.map((q) => {
      const selected = answers[q.id];
      const isCorrect = Number(selected) === q.correct;
      if (isCorrect) score += 1;
      return { questionId: q.id, selected, correct: q.correct, isCorrect };
    });

    await pool.query(
      "INSERT INTO quiz_attempts (user_id, quiz_id, score, total) VALUES ($1, $2, $3, $4)",
      [req.user.id, quizId, score, total]
    );

    console.log(`[QUIZ] User ${req.user.email} completed quiz ${quizId}: ${score}/${total}`);
    res.json({ success: true, data: { score, total, details } });
  } catch (err) {
    next(err);
  }
}

async function createQuiz(req, res, next) {
  const pool = getPool();
  let client;

  try {
    const { title, description, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Thieu thong tin quiz hoac cau hoi" });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    const quizResult = await client.query(
      `INSERT INTO quizzes (title, description)
       VALUES ($1, $2)
       RETURNING id, title, description, created_at`,
      [title, description || ""]
    );
    const newQuiz = quizResult.rows[0];

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.answers) || q.correct === undefined) {
        throw Object.assign(new Error("Du lieu cau hoi khong hop le"), { status: 400 });
      }

      await client.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES ($1, $2, $3, $4)",
        [newQuiz.id, q.question, JSON.stringify(q.answers), q.correct]
      );
    }

    await client.query("COMMIT");

    console.log(`[QUIZ] Admin created quiz: "${title}" (id: ${newQuiz.id})`);
    res.status(201).json({ success: true, message: "Tao quiz thanh cong", data: { quiz: newQuiz } });
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    next(err);
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = { getAllQuizzes, getQuizById, submitQuiz, createQuiz };
