const express = require("express");
const router = express.Router();
const { getHistory, getAttemptById } = require("../controllers/history.controller");
const { authenticate } = require("../middleware/auth");

// GET /api/history
router.get("/", authenticate, getHistory);

// GET /api/history/:id
router.get("/:id", authenticate, getAttemptById);

module.exports = router;
