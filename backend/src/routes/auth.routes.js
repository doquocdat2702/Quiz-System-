const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", authenticate, getMe);

// PUT /api/auth/me
router.put("/me", authenticate, updateProfile);

module.exports = router;
