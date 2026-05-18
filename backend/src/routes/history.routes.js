const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/history.controller");
const { authenticate } = require("../middleware/auth");

// GET /api/history
router.get("/", authenticate, getHistory);

module.exports = router;
