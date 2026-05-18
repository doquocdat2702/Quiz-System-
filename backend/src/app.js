const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("[:date[clf]] :method :url :status :response-time ms"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server đang chạy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + "s",
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/history", historyRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} không tồn tại` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
