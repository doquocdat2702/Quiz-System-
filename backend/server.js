require("dotenv").config();
const app = require("./src/app");
const { initDb } = require("./src/config/database");

const PORT = process.env.PORT || 8080;

async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log("---------------------------------------------");
    console.log("[SERVER] Quiz System Backend dang chay");
    console.log(`[SERVER] http://localhost:${PORT}`);
    console.log(`[SERVER] Health: http://localhost:${PORT}/api/health`);
    console.log(`[SERVER] Moi truong: ${process.env.NODE_ENV}`);
    console.log("---------------------------------------------");
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Server startup failed:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Rejection:", reason);
  process.exit(1);
});
