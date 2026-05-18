const express = require("express");
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  getQuizByCode,
  getQuizForEdit,
  submitQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quiz.controller");
const { authenticate } = require("../middleware/auth");

// GET /api/quizzes
router.get("/", authenticate, getAllQuizzes);

// GET /api/quizzes/code/:code
router.get("/code/:code", authenticate, getQuizByCode);

// GET /api/quizzes/:id/edit
router.get("/:id/edit", authenticate, getQuizForEdit);

// GET /api/quizzes/:id
router.get("/:id", authenticate, getQuizById);

// POST /api/quizzes/:id/submit
router.post("/:id/submit", authenticate, submitQuiz);

// POST /api/quizzes
router.post("/", authenticate, createQuiz);

// PUT /api/quizzes/:id
router.put("/:id", authenticate, updateQuiz);

// DELETE /api/quizzes/:id
router.delete("/:id", authenticate, deleteQuiz);

module.exports = router;
