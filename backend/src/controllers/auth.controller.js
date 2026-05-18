const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getPool } = require("../config/database");

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui long dien day du thong tin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mat khau phai co it nhat 6 ky tu" });
    }

    const pool = getPool();
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email da duoc su dung" });
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

    res.status(201).json({
      success: true,
      message: "Dang ky thanh cong",
      data: { user, token: makeToken(user) },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui long nhap email va mat khau" });
    }

    const pool = getPool();
    const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoac mat khau khong dung" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoac mat khau khong dung" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Dang nhap thanh cong",
      data: { user: userWithoutPassword, token: makeToken(userWithoutPassword) },
    });
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
      return res.status(404).json({ success: false, message: "Nguoi dung khong ton tai" });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = cleanEmail(req.body.email);
    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Ten va email khong duoc de trong" });
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Mat khau moi phai co it nhat 6 ky tu" });
    }

    const pool = getPool();
    const [[user]] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: "Nguoi dung khong ton tai" });
    }

    const [[emailOwner]] = await pool.query("SELECT id FROM users WHERE email = ? AND id <> ?", [email, req.user.id]);
    if (emailOwner) {
      return res.status(409).json({ success: false, message: "Email da duoc su dung" });
    }

    let passwordSql = "";
    const params = [name, email];

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Vui long nhap mat khau hien tai" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Mat khau hien tai khong dung" });
      }
      passwordSql = ", password = ?";
      params.push(await bcrypt.hash(newPassword, 10));
    }

    params.push(req.user.id);
    await pool.query(`UPDATE users SET name = ?, email = ?${passwordSql} WHERE id = ?`, params);

    const [[updatedUser]] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Cap nhat ho so thanh cong",
      data: { user: updatedUser, token: makeToken(updatedUser) },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe, updateProfile };
