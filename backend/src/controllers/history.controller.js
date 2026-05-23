const { getPool } = require("../config/database");

async function getHistory(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT
         qa.id,
         q.title AS quiz,
         qa.score,
         qa.total,
         qa.created_at
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.user_id = $1
       ORDER BY qa.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: { history: result.rows } });
  } catch (err) {
    next(err);
  }
}

async function getAttemptById(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT
         qa.id,
         q.title AS quiz,
         qa.score,
         qa.total,
         qa.created_at,
         qa.quiz_id
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.id = $1 AND qa.user_id = $2`,
      [req.params.id, req.user.id]
    );

    const attempt = result.rows[0];
    if (!attempt) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lần làm bài này" });
    }

    res.json({ success: true, data: { attempt: { ...attempt, details: [] } } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, getAttemptById };
