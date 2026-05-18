const express = require("express");
const router = express.Router();
const { getAllQuizzes, getQuizById, submitQuiz, createQuiz } = require("../controllers/quiz.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

// GET /api/quizzes
router.get("/", authenticate, getAllQuizzes);

// GET /api/quizzes/:id
router.get("/:id", authenticate, getQuizById);

// POST /api/quizzes/:id/submit
router.post("/:id/submit", authenticate, submitQuiz);

// POST /api/quizzes  (admin only)
router.post("/", authenticate, authorizeAdmin, createQuiz);

module.exports = router;
