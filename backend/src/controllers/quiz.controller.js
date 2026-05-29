const { getPool, generateCode } = require("../config/database");

async function getAllQuizzes(_req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT q.id, q.title, q.description, q.code, q.created_at, q.created_by,
              COUNT(qu.id)::int AS question_count
       FROM quizzes q
       LEFT JOIN questions qu ON qu.quiz_id = q.id
       GROUP BY q.id
       ORDER BY q.id ASC`,
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
      "SELECT id, title, description, code, created_at, created_by FROM quizzes WHERE id = $1",
      [req.params.id],
    );
    const quiz = quizResult.rows[0];

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz không tồn tại" });
    }

    const questionsResult = await pool.query(
      "SELECT id, question, answers FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
      [quiz.id],
    );

    const questions = questionsResult.rows.map((q) => ({
      ...q,
      answers:
        typeof q.answers === "string" ? JSON.parse(q.answers) : q.answers,
    }));

    res.json({ success: true, data: { quiz: { ...quiz, questions } } });
  } catch (err) {
    next(err);
  }
}

async function getQuizByCode(req, res, next) {
  try {
    const pool = getPool();
    const quizResult = await pool.query(
      "SELECT id, title, description, code, created_at, created_by FROM quizzes WHERE code = $1",
      [req.params.code.toUpperCase()],
    );
    const quiz = quizResult.rows[0];

    if (!quiz) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy bài test với mã này",
        });
    }

    res.json({ success: true, data: { quiz } });
  } catch (err) {
    next(err);
  }
}

async function getQuizForEdit(req, res, next) {
  try {
    const pool = getPool();
    const quizResult = await pool.query(
      "SELECT id, title, description, code, created_at, created_by FROM quizzes WHERE id = $1",
      [req.params.id],
    );
    const quiz = quizResult.rows[0];

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz không tồn tại" });
    }

    if (String(quiz.created_by) !== String(req.user.id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền sửa bài test này",
        });
    }

    const questionsResult = await pool.query(
      "SELECT id, question, answers, correct FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
      [quiz.id],
    );

    const questions = questionsResult.rows.map((q) => ({
      ...q,
      answers:
        typeof q.answers === "string" ? JSON.parse(q.answers) : q.answers,
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
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu câu trả lời không hợp lệ" });
    }

    const quizResult = await pool.query(
      "SELECT id FROM quizzes WHERE id = $1",
      [quizId],
    );
    const quiz = quizResult.rows[0];
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz không tồn tại" });
    }

    const questionsResult = await pool.query(
      "SELECT id, question, answers, correct FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
      [quizId],
    );
    const questions = questionsResult.rows;

    const total = questions.length;
    let score = 0;
    const details = questions.map((q) => {
      const parsedAnswers =
        typeof q.answers === "string" ? JSON.parse(q.answers) : q.answers;
      const selected = answers[q.id];
      const isCorrect = Number(selected) === q.correct;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        question: q.question,
        answers: parsedAnswers,
        selected,
        correct: q.correct,
        isCorrect,
      };
    });

    const attemptResult = await pool.query(
      "INSERT INTO quiz_attempts (user_id, quiz_id, score, total) VALUES ($1, $2, $3, $4) RETURNING id",
      [req.user.id, quizId, score, total],
    );

    console.log(
      `[QUIZ] User ${req.user.email} completed quiz ${quizId}: ${score}/${total}`,
    );
    res.json({
      success: true,
      data: { attemptId: attemptResult.rows[0].id, score, total, details },
    });
  } catch (err) {
    next(err);
  }
}
baoloi;

async function createQuiz(req, res, next) {
  const pool = getPool();
  let client;

  try {
    const { title, description, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin quiz hoặc câu hỏi" });
    }

    let code;
    let attempts = 0;
    while (attempts < 10) {
      code = generateCode();
      const existing = await pool.query(
        "SELECT id FROM quizzes WHERE code = $1",
        [code],
      );
      if (existing.rows.length === 0) break;
      attempts++;
    }

    client = await pool.connect();
    await client.query("BEGIN");

    const quizResult = await client.query(
      `INSERT INTO quizzes (title, description, code, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, code, created_at, created_by`,
      [title, description || "", code, req.user.id],
    );
    const newQuiz = quizResult.rows[0];

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.answers) || q.correct === undefined) {
        throw Object.assign(new Error("Dữ liệu câu hỏi không hợp lệ"), {
          status: 400,
        });
      }

      await client.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES ($1, $2, $3, $4)",
        [newQuiz.id, q.question, JSON.stringify(q.answers), q.correct],
      );
    }

    await client.query("COMMIT");

    console.log(
      `[QUIZ] User ${req.user.email} created quiz: "${title}" (id: ${newQuiz.id}, code: ${code})`,
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Tạo quiz thành công",
        data: { quiz: newQuiz },
      });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    next(err);
  } finally {
    if (client) client.release();
  }
}

async function updateQuiz(req, res, next) {
  const pool = getPool();
  let client;

  try {
    const { title, description, questions } = req.body;
    const quizId = req.params.id;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin quiz hoặc câu hỏi" });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    const quizResult = await client.query(
      "UPDATE quizzes SET title = $1, description = $2 WHERE id = $3 AND created_by = $4 RETURNING id, title, description, code, created_at, created_by",
      [title, description || "", quizId, req.user.id],
    );

    if (!quizResult.rows[0]) {
      await client.query("ROLLBACK");
      const exists = await pool.query("SELECT id FROM quizzes WHERE id = $1", [
        quizId,
      ]);
      if (!exists.rows[0])
        return res
          .status(404)
          .json({ success: false, message: "Quiz không tồn tại" });
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền sửa bài test này",
        });
    }

    await client.query("DELETE FROM questions WHERE quiz_id = $1", [quizId]);

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.answers) || q.correct === undefined) {
        throw Object.assign(new Error("Dữ liệu câu hỏi không hợp lệ"), {
          status: 400,
        });
      }

      await client.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES ($1, $2, $3, $4)",
        [quizId, q.question, JSON.stringify(q.answers), q.correct],
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Cập nhật quiz thành công",
      data: { quiz: quizResult.rows[0] },
    });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    next(err);
  } finally {
    if (client) client.release();
  }
}

async function deleteQuiz(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      "DELETE FROM quizzes WHERE id = $1 AND created_by = $2 RETURNING id",
      [req.params.id, req.user.id],
    );

    if (!result.rows[0]) {
      const exists = await pool.query("SELECT id FROM quizzes WHERE id = $1", [
        req.params.id,
      ]);
      if (!exists.rows[0])
        return res
          .status(404)
          .json({ success: false, message: "Quiz không tồn tại" });
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền xóa bài test này",
        });
    }

    res.json({ success: true, message: "Đã xóa quiz" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllQuizzes,
  getQuizById,
  getQuizByCode,
  getQuizForEdit,
  submitQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
