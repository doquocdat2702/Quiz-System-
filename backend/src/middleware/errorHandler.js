function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Lỗi server nội bộ";

  console.error(`[ERROR] ${req.method} ${req.path} - ${status}: ${message}`);
  if (process.env.NODE_ENV === "development" && err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
