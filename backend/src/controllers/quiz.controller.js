const { getPool, createUniqueQuizCode } = require("../config/database");

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function validateQuizPayload(title, questions) {
  if (!String(title || "").trim()) {
    return "Vui long nhap tieu de bai test";
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return "Bai test can co it nhat 1 cau hoi";
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const label = `Cau ${i + 1}`;
    if (!q || !String(q.question || "").trim()) {
      return `${label}: vui long nhap noi dung cau hoi`;
    }
    if (!Array.isArray(q.answers) || q.answers.length < 2) {
      return `${label}: can it nhat 2 dap an`;
    }
    const cleanAnswers = q.answers.map((answer) => String(answer || "").trim());
    if (cleanAnswers.some((answer) => !answer)) {
      return `${label}: dap an khong duoc de trong`;
    }
    if (q.correct === undefined || q.correct === null || q.correct === "") {
      return `${label}: vui long chon dap an dung`;
    }
    const correct = Number(q.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct >= q.answers.length) {
      return `${label}: dap an dung khong hop le`;
    }
  }

  return null;
}

async function getAllQuizzes(_req, res, next) {
  try {
    const pool = getPool();
    const [quizzes] = await pool.query(
      `SELECT
         q.id,
         q.code,
         q.title,
         q.description,
         q.created_by,
         q.created_at,
         COUNT(questions.id) AS question_count,
         users.name AS creator_name
       FROM quizzes q
       LEFT JOIN questions ON questions.quiz_id = q.id
       LEFT JOIN users ON users.id = q.created_by
       GROUP BY q.id
       ORDER BY q.created_at DESC, q.id DESC`
    );

    res.json({ success: true, data: { quizzes } });
  } catch (err) {
    next(err);
  }
}

async function findQuiz(identifier, byCode = false) {
  const pool = getPool();
  const where = byCode ? "q.code = ?" : "q.id = ?";
  const value = byCode ? normalizeCode(identifier) : Number(identifier);

  const [[quiz]] = await pool.query(
    `SELECT
       q.id,
       q.code,
       q.title,
       q.description,
       q.created_by,
       q.created_at,
       users.name AS creator_name
     FROM quizzes q
     LEFT JOIN users ON users.id = q.created_by
     WHERE ${where}`,
    [value]
  );

  if (!quiz) return null;

  const [questions] = await pool.query(
    "SELECT id, question, answers FROM questions WHERE quiz_id = ? ORDER BY id ASC",
    [quiz.id]
  );

  return {
    ...quiz,
    questions: questions.map((q) => ({
      ...q,
      answers: parseJson(q.answers, []),
    })),
  };
}

async function findQuizForManage(quizId) {
  const pool = getPool();
  const [[quiz]] = await pool.query(
    `SELECT
       q.id,
       q.code,
       q.title,
       q.description,
       q.created_by,
       q.created_at,
       COUNT(questions.id) AS question_count
     FROM quizzes q
     LEFT JOIN questions ON questions.quiz_id = q.id
     WHERE q.id = ?
     GROUP BY q.id`,
    [quizId]
  );

  if (!quiz) return { error: { status: 404, message: "Khong tim thay bai test" } };

  const [questions] = await pool.query(
    "SELECT id, question, answers, correct FROM questions WHERE quiz_id = ? ORDER BY id ASC",
    [quiz.id]
  );

  return {
    quiz: {
      ...quiz,
      questions: questions.map((q) => ({
        ...q,
        answers: parseJson(q.answers, []),
      })),
    },
  };
}

async function getQuizById(req, res, next) {
  try {
    const quiz = await findQuiz(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Khong tim thay bai test" });
    }

    res.json({ success: true, data: { quiz } });
  } catch (err) {
    next(err);
  }
}

async function getQuizByCode(req, res, next) {
  try {
    const code = normalizeCode(req.params.code);
    if (!code) {
      return res.status(400).json({ success: false, message: "Vui long nhap ma bai test" });
    }

    const quiz = await findQuiz(code, true);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Ma bai test khong ton tai" });
    }

    res.json({ success: true, data: { quiz } });
  } catch (err) {
    next(err);
  }
}

async function getQuizForEdit(req, res, next) {
  try {
    const result = await findQuizForManage(Number(req.params.id));
    if (result.error) {
      return res.status(result.error.status).json({ success: false, message: result.error.message });
    }

    res.json({ success: true, data: { quiz: result.quiz } });
  } catch (err) {
    next(err);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const pool = getPool();
    const quizId = Number(req.params.id);
    const { answers } = req.body;

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Du lieu cau tra loi khong hop le" });
    }

    const [[quiz]] = await pool.query("SELECT id, title FROM quizzes WHERE id = ?", [quizId]);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Khong tim thay bai test" });
    }

    const [questions] = await pool.query(
      "SELECT id, question, answers, correct FROM questions WHERE quiz_id = ? ORDER BY id ASC",
      [quizId]
    );

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: "Bai test chua co cau hoi" });
    }

    let score = 0;
    const details = questions.map((q) => {
      const selectedRaw = answers[q.id];
      const selected = selectedRaw === undefined || selectedRaw === null || selectedRaw === "" ? null : Number(selectedRaw);
      const correct = Number(q.correct);
      const isCorrect = Number.isInteger(selected) && selected === correct;
      if (isCorrect) score++;

      return {
        questionId: q.id,
        question: q.question,
        answers: parseJson(q.answers, []),
        selected,
        correct,
        isCorrect,
      };
    });

    const [attemptResult] = await pool.query(
      "INSERT INTO quiz_attempts (user_id, quiz_id, score, total, answers, details) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, quizId, score, questions.length, JSON.stringify(answers), JSON.stringify(details)]
    );

    res.json({
      success: true,
      data: {
        attemptId: attemptResult.insertId,
        quizId,
        quizTitle: quiz.title,
        score,
        total: questions.length,
        details,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createQuiz(req, res, next) {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const questions = req.body.questions;
    const validationError = validateQuizPayload(title, questions);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    await conn.beginTransaction();

    const code = await createUniqueQuizCode(conn);
    const [quizResult] = await conn.query(
      "INSERT INTO quizzes (code, created_by, title, description) VALUES (?, ?, ?, ?)",
      [code, req.user.id, title, description]
    );

    const quizId = quizResult.insertId;
    for (const item of questions) {
      const answers = item.answers.map((answer) => String(answer).trim());
      await conn.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)",
        [quizId, String(item.question).trim(), JSON.stringify(answers), Number(item.correct)]
      );
    }

    await conn.commit();

    const [[quiz]] = await pool.query(
      `SELECT
         q.id,
         q.code,
         q.title,
         q.description,
         q.created_by,
         q.created_at,
         COUNT(questions.id) AS question_count
       FROM quizzes q
       LEFT JOIN questions ON questions.quiz_id = q.id
       WHERE q.id = ?
       GROUP BY q.id`,
      [quizId]
    );

    res.status(201).json({
      success: true,
      message: "Tao bai test thanh cong",
      data: { quiz },
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function updateQuiz(req, res, next) {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    const quizId = Number(req.params.id);
    const manageResult = await findQuizForManage(quizId);
    if (manageResult.error) {
      return res.status(manageResult.error.status).json({ success: false, message: manageResult.error.message });
    }

    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const questions = req.body.questions;
    const validationError = validateQuizPayload(title, questions);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    await conn.beginTransaction();
    await conn.query("UPDATE quizzes SET title = ?, description = ? WHERE id = ?", [title, description, quizId]);
    await conn.query("DELETE FROM questions WHERE quiz_id = ?", [quizId]);

    for (const item of questions) {
      const answers = item.answers.map((answer) => String(answer).trim());
      await conn.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)",
        [quizId, String(item.question).trim(), JSON.stringify(answers), Number(item.correct)]
      );
    }

    await conn.commit();

    const updated = await findQuizForManage(quizId);
    res.json({ success: true, message: "Cap nhat bai test thanh cong", data: { quiz: updated.quiz } });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function deleteQuiz(req, res, next) {
  try {
    const quizId = Number(req.params.id);
    const manageResult = await findQuizForManage(quizId);
    if (manageResult.error) {
      return res.status(manageResult.error.status).json({ success: false, message: manageResult.error.message });
    }

    const pool = getPool();
    await pool.query("DELETE FROM quizzes WHERE id = ?", [quizId]);
    res.json({ success: true, message: "Da xoa bai test" });
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
