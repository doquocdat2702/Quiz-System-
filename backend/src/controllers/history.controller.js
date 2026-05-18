const { getPool } = require("../config/database");

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getHistory(req, res, next) {
  try {
    const pool = getPool();
    const [history] = await pool.query(
      `SELECT
         qa.id,
         qa.quiz_id,
         q.code,
         q.title AS quiz,
         qa.score,
         qa.total,
         ROUND((qa.score / qa.total) * 100) AS percent,
         qa.created_at
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.user_id = ?
       ORDER BY qa.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: { history } });
  } catch (err) {
    next(err);
  }
}

async function getAttemptById(req, res, next) {
  try {
    const pool = getPool();
    const [[attempt]] = await pool.query(
      `SELECT
         qa.id,
         qa.quiz_id,
         q.code,
         q.title AS quiz,
         q.description,
         qa.score,
         qa.total,
         qa.answers,
         qa.details,
         qa.created_at
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.id = ? AND qa.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Khong tim thay ket qua" });
    }

    res.json({
      success: true,
      data: {
        attempt: {
          ...attempt,
          answers: parseJson(attempt.answers, {}),
          details: parseJson(attempt.details, []),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, getAttemptById };
