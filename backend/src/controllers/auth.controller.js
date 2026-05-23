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
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[AUTH] Register success: ${email}`);
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
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    delete userWithoutPassword.role;

    console.log(`[AUTH] Login success: ${email}`);
    res.json({ success: true, message: "Đăng nhập thành công", data: { user: userWithoutPassword, token } });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const pool = getPool();
    const { name, email, currentPassword, newPassword } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Tên và email không được để trống" });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    if (email !== user.email) {
      const existing = await pool.query("SELECT id FROM users WHERE email = $1 AND id != $2", [email, req.user.id]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
      }
    }

    let hashedPassword = user.password;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu hiện tại" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, created_at",
      [name, email, hashedPassword, req.user.id]
    );
    const updatedUser = result.rows[0];

    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[AUTH] Profile updated: ${email}`);
    res.json({ success: true, message: "Cập nhật hồ sơ thành công", data: { user: updatedUser, token } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe, updateProfile };
