const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getPool } = require("../config/database");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui long dien day du thong tin" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mat khau phai co it nhat 6 ky tu" });
    }

    const pool = getPool();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email da duoc su dung" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, "user"]
    );
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[AUTH] Register success: ${email}`);
    res.status(201).json({ success: true, message: "Dang ky thanh cong", data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui long nhap email va mat khau" });
    }

    const pool = getPool();
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoac mat khau khong dung" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoac mat khau khong dung" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    console.log(`[AUTH] Login success: ${email}`);
    res.json({ success: true, message: "Dang nhap thanh cong", data: { user: userWithoutPassword, token } });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Nguoi dung khong ton tai" });
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
