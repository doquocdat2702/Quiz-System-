const { getPool } = require("../config/database");

async function getHistory(req, res, next) {
  try {
    const pool = getPool();
    const [history] = await pool.query(
      `SELECT
         qa.id,
         q.title  AS quiz,
         qa.score,
         qa.total,
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

module.exports = { getHistory };
