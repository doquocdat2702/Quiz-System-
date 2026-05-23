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

router.get("/", authenticate, getAllQuizzes);
router.get("/code/:code", authenticate, getQuizByCode);
router.get("/:id/edit", authenticate, getQuizForEdit);
router.get("/:id", authenticate, getQuizById);
router.post("/", authenticate, createQuiz);
router.post("/:id/submit", authenticate, submitQuiz);
router.put("/:id", authenticate, updateQuiz);
router.delete("/:id", authenticate, deleteQuiz);

module.exports = router;
