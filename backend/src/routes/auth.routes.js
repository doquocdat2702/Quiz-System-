const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);

module.exports = router;
