const express = require("express");
const router = express.Router();
const { getHistory, getAttemptById } = require("../controllers/history.controller");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, getHistory);
router.get("/:id", authenticate, getAttemptById);

module.exports = router;
