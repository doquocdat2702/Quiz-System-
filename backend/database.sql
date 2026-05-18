-- ============================================================
--  Quiz System - Database Schema & Seed Data
--  Database: MySQL 8.0+
--  Tạo bởi: Quiz System Backend
-- ============================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS `quiz_system`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `quiz_system`;

-- ============================================================
--  BẢNG: users
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100)            NOT NULL,
  `email`      VARCHAR(150)            NOT NULL UNIQUE,
  `password`   VARCHAR(255)            NOT NULL,
  `role`       ENUM('admin', 'user')   NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP               DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  BẢNG: quizzes
-- ============================================================
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `title`       VARCHAR(200) NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  BẢNG: questions
-- ============================================================
CREATE TABLE IF NOT EXISTS `questions` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `quiz_id`    INT  NOT NULL,
  `question`   TEXT NOT NULL,
  `answers`    JSON NOT NULL,        -- VD: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"]
  `correct`    INT  NOT NULL,        -- Index của đáp án đúng (0-based)
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_questions_quiz`
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  BẢNG: quiz_attempts
-- ============================================================
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT NOT NULL,
  `quiz_id`    INT NOT NULL,
  `score`      INT NOT NULL,
  `total`      INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_attempts_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attempts_quiz`
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  SEED DATA
-- ============================================================

-- Admin account (password: 123456)
INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ─── Quiz 1: React ──────────────────────────────────────────
INSERT INTO `quizzes` (`title`, `description`) VALUES
('React Quiz', 'Kiểm tra kiến thức React của bạn');

SET @quiz1 = LAST_INSERT_ID();

INSERT INTO `questions` (`quiz_id`, `question`, `answers`, `correct`) VALUES
(@quiz1, 'React là gì?',
  '["Framework JavaScript", "Thư viện JavaScript", "Database", "Ngôn ngữ lập trình"]', 1),
(@quiz1, 'JSX dùng để làm gì?',
  '["Mô tả giao diện UI", "Kết nối server", "Quản lý database", "Xử lý CSS"]', 0),
(@quiz1, 'Hook nào dùng để quản lý state trong React?',
  '["useEffect", "useRef", "useState", "useContext"]', 2),
(@quiz1, 'useEffect được dùng để làm gì?',
  '["Quản lý state", "Xử lý side effects", "Tạo component", "Định nghĩa style"]', 1),
(@quiz1, 'Props trong React là gì?',
  '["Biến nội bộ của component", "Dữ liệu truyền từ cha sang con", "CSS class", "Event handler"]', 1);

-- ─── Quiz 2: JavaScript ─────────────────────────────────────
INSERT INTO `quizzes` (`title`, `description`) VALUES
('JavaScript Quiz', 'Kiểm tra kiến thức JavaScript cơ bản');

SET @quiz2 = LAST_INSERT_ID();

INSERT INTO `questions` (`quiz_id`, `question`, `answers`, `correct`) VALUES
(@quiz2, 'JavaScript là ngôn ngữ lập trình loại gì?',
  '["Compiled", "Interpreted", "Assembly", "Machine code"]', 1),
(@quiz2, 'Từ khóa nào dùng để khai báo biến không thay đổi?',
  '["var", "let", "const", "static"]', 2),
(@quiz2, 'typeof null trả về gì?',
  '["null", "undefined", "object", "string"]', 2),
(@quiz2, 'Arrow function được giới thiệu ở phiên bản nào?',
  '["ES3", "ES5", "ES6", "ES8"]', 2),
(@quiz2, 'Promise.all() làm gì?',
  '["Chạy các promise tuần tự", "Chạy tất cả promise đồng thời, trả về khi tất cả hoàn thành", "Hủy tất cả promise", "Chỉ chạy promise đầu tiên"]', 1);

-- ─── Quiz 3: HTML & CSS ─────────────────────────────────────
INSERT INTO `quizzes` (`title`, `description`) VALUES
('HTML & CSS Quiz', 'Kiểm tra kiến thức HTML và CSS');

SET @quiz3 = LAST_INSERT_ID();

INSERT INTO `questions` (`quiz_id`, `question`, `answers`, `correct`) VALUES
(@quiz3, 'HTML viết tắt của gì?',
  '["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"]', 0),
(@quiz3, 'Thẻ nào dùng để tạo liên kết trong HTML?',
  '["<link>", "<a>", "<href>", "<url>"]', 1),
(@quiz3, 'CSS viết tắt của gì?',
  '["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"]', 0),
(@quiz3, 'Thuộc tính CSS nào dùng để thay đổi màu chữ?',
  '["font-color", "text-color", "color", "foreground-color"]', 2),
(@quiz3, 'display: flex dùng để làm gì?',
  '["Ẩn element", "Tạo layout linh hoạt với flexbox", "Thêm animation", "Đặt vị trí tuyệt đối"]', 1);
