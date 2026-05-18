const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "quiz_system",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

async function initDb() {
  // Kết nối không chỉ định database để tạo database trước
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 3,
  });

  const conn = await tempPool.getConnection();
  try {
    const dbName = process.env.DB_NAME || "quiz_system";
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('admin','user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(200) NOT NULL,
        description TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        quiz_id    INT NOT NULL,
        question   TEXT NOT NULL,
        answers    JSON NOT NULL,
        correct    INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        quiz_id    INT NOT NULL,
        score      INT NOT NULL,
        total      INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    console.log("[DB] Các bảng đã được khởi tạo");
    await seedData(conn);
  } finally {
    conn.release();
    await tempPool.end();
  }

  console.log("[DB] Kết nối MySQL thành công —", `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

async function seedData(conn) {
  const [rows] = await conn.query("SELECT COUNT(*) as c FROM quizzes");
  if (rows[0].c > 0) return;

  // Admin user
  const hash = await bcrypt.hash("123456", 10);
  await conn.query(
    "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin", "admin@gmail.com", hash, "admin"]
  );

  // Quiz 1 – React
  const [q1] = await conn.query(
    "INSERT INTO quizzes (title, description) VALUES (?, ?)",
    ["React Quiz", "Kiểm tra kiến thức React của bạn"]
  );
  const quiz1Id = q1.insertId;
  const reactQuestions = [
    ["React là gì?", ["Framework JavaScript", "Thư viện JavaScript", "Database", "Ngôn ngữ lập trình"], 1],
    ["JSX dùng để làm gì?", ["Mô tả giao diện UI", "Kết nối server", "Quản lý database", "Xử lý CSS"], 0],
    ["Hook nào dùng để quản lý state?", ["useEffect", "useRef", "useState", "useContext"], 2],
    ["useEffect được dùng để làm gì?", ["Quản lý state", "Xử lý side effects", "Tạo component", "Định nghĩa style"], 1],
    ["Props trong React là gì?", ["Biến nội bộ", "Dữ liệu truyền từ cha sang con", "CSS class", "Event handler"], 1],
  ];
  for (const [q, a, c] of reactQuestions) {
    await conn.query("INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)", [quiz1Id, q, JSON.stringify(a), c]);
  }

  // Quiz 2 – JavaScript
  const [q2] = await conn.query(
    "INSERT INTO quizzes (title, description) VALUES (?, ?)",
    ["JavaScript Quiz", "Kiểm tra kiến thức JavaScript cơ bản"]
  );
  const quiz2Id = q2.insertId;
  const jsQuestions = [
    ["JavaScript là ngôn ngữ loại gì?", ["Compiled", "Interpreted", "Assembly", "Machine code"], 1],
    ["Từ khóa khai báo biến không thay đổi?", ["var", "let", "const", "static"], 2],
    ["typeof null trả về gì?", ["null", "undefined", "object", "string"], 2],
    ["Arrow function xuất hiện ở phiên bản nào?", ["ES3", "ES5", "ES6", "ES8"], 2],
    ["Promise.all() làm gì?", ["Chạy tuần tự", "Chạy đồng thời, chờ tất cả xong", "Hủy tất cả", "Chỉ chạy đầu tiên"], 1],
  ];
  for (const [q, a, c] of jsQuestions) {
    await conn.query("INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)", [quiz2Id, q, JSON.stringify(a), c]);
  }

  // Quiz 3 – HTML & CSS
  const [q3] = await conn.query(
    "INSERT INTO quizzes (title, description) VALUES (?, ?)",
    ["HTML & CSS Quiz", "Kiểm tra kiến thức HTML và CSS"]
  );
  const quiz3Id = q3.insertId;
  const htmlQuestions = [
    ["HTML viết tắt của gì?", ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], 0],
    ["Thẻ nào tạo liên kết trong HTML?", ["<link>", "<a>", "<href>", "<url>"], 1],
    ["CSS viết tắt của gì?", ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"], 0],
    ["Thuộc tính CSS đổi màu chữ?", ["font-color", "text-color", "color", "foreground-color"], 2],
    ["display: flex dùng để làm gì?", ["Ẩn element", "Tạo layout flexbox", "Thêm animation", "Đặt vị trí tuyệt đối"], 1],
  ];
  for (const [q, a, c] of htmlQuestions) {
    await conn.query("INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)", [quiz3Id, q, JSON.stringify(a), c]);
  }

  console.log("[DB] Seed data tạo thành công");
}

module.exports = { getPool, initDb };
