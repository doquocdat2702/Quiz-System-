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

function makeQuizCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function createUniqueQuizCode(conn) {
  for (let i = 0; i < 20; i++) {
    const code = makeQuizCode();
    const [[existing]] = await conn.query("SELECT id FROM quizzes WHERE code = ?", [code]);
    if (!existing) return code;
  }
  throw new Error("Khong the tao ma quiz duy nhat");
}

async function columnExists(conn, table, column) {
  const dbName = process.env.DB_NAME || "quiz_system";
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS c
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbName, table, column]
  );
  return rows[0].c > 0;
}

async function indexExists(conn, table, indexName) {
  const dbName = process.env.DB_NAME || "quiz_system";
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS c
     FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [dbName, table, indexName]
  );
  return rows[0].c > 0;
}

async function migrateExistingSchema(conn) {
  if (!(await columnExists(conn, "quizzes", "code"))) {
    await conn.query("ALTER TABLE quizzes ADD COLUMN code VARCHAR(12) NULL AFTER id");
  }

  if (!(await columnExists(conn, "quizzes", "created_by"))) {
    await conn.query("ALTER TABLE quizzes ADD COLUMN created_by INT NULL AFTER code");
    await conn.query(
      "ALTER TABLE quizzes ADD CONSTRAINT fk_quizzes_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL"
    );
  }

  if (!(await indexExists(conn, "quizzes", "idx_quizzes_code_unique"))) {
    await conn.query("CREATE UNIQUE INDEX idx_quizzes_code_unique ON quizzes(code)");
  }

  if (!(await columnExists(conn, "quiz_attempts", "answers"))) {
    await conn.query("ALTER TABLE quiz_attempts ADD COLUMN answers JSON NULL AFTER total");
  }

  if (!(await columnExists(conn, "quiz_attempts", "details"))) {
    await conn.query("ALTER TABLE quiz_attempts ADD COLUMN details JSON NULL AFTER answers");
  }

  const [quizzesWithoutCode] = await conn.query("SELECT id FROM quizzes WHERE code IS NULL OR code = ''");
  for (const quiz of quizzesWithoutCode) {
    await conn.query("UPDATE quizzes SET code = ? WHERE id = ?", [await createUniqueQuizCode(conn), quiz.id]);
  }
}

async function initDb() {
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
        code        VARCHAR(12) UNIQUE,
        created_by  INT NULL,
        title       VARCHAR(200) NOT NULL,
        description TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
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
        answers    JSON NULL,
        details    JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    await migrateExistingSchema(conn);

    console.log("[DB] Tables are ready");
    await seedData(conn);
  } finally {
    conn.release();
    await tempPool.end();
  }

  console.log("[DB] MySQL connected:", `${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "quiz_system"}`);
}

async function seedData(conn) {
  const [rows] = await conn.query("SELECT COUNT(*) as c FROM quizzes");
  if (rows[0].c > 0) return;

  const hash = await bcrypt.hash("123456", 10);
  await conn.query(
    "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Demo User", "demo@gmail.com", hash, "user"]
  );

  const seedQuizzes = [
    {
      title: "React Quiz",
      description: "Kiem tra kien thuc React co ban",
      questions: [
        ["React la gi?", ["Framework JavaScript", "Thu vien JavaScript", "Database", "Ngon ngu lap trinh"], 1],
        ["JSX dung de lam gi?", ["Mo ta giao dien UI", "Ket noi server", "Quan ly database", "Xu ly CSS"], 0],
        ["Hook nao dung de quan ly state?", ["useEffect", "useRef", "useState", "useContext"], 2],
      ],
    },
    {
      title: "JavaScript Quiz",
      description: "Kiem tra kien thuc JavaScript co ban",
      questions: [
        ["Tu khoa khai bao bien khong thay doi?", ["var", "let", "const", "static"], 2],
        ["typeof null tra ve gi?", ["null", "undefined", "object", "string"], 2],
        ["Promise.all() lam gi?", ["Chay tuan tu", "Cho tat ca promise hoan thanh", "Huy tat ca", "Chi chay promise dau tien"], 1],
      ],
    },
  ];

  for (const quiz of seedQuizzes) {
    const [result] = await conn.query(
      "INSERT INTO quizzes (code, title, description) VALUES (?, ?, ?)",
      [await createUniqueQuizCode(conn), quiz.title, quiz.description]
    );

    for (const [question, answers, correct] of quiz.questions) {
      await conn.query(
        "INSERT INTO questions (quiz_id, question, answers, correct) VALUES (?, ?, ?, ?)",
        [result.insertId, question, JSON.stringify(answers), correct]
      );
    }
  }

  console.log("[DB] Seed data created");
}

module.exports = { getPool, initDb, createUniqueQuizCode };
