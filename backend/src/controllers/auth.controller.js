const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getPool } = require("../config/database");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const pool = getPool();
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );

    const [[user]] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[AUTH] Đăng ký thành công: ${email}`);
    res.status(201).json({ success: true, message: "Đăng ký thành công", data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
    }

    const pool = getPool();
    const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    console.log(`[AUTH] Đăng nhập thành công: ${email}`);
    res.json({ success: true, message: "Đăng nhập thành công", data: { user: userWithoutPassword, token } });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const pool = getPool();
    const [[user]] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
