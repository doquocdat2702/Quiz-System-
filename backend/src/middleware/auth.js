const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Token không được cung cấp" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
