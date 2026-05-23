import { Link } from "react-router-dom";
import toast from "react-hot-toast";

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Đã copy mã bài test");
        return;
      } catch {
        // Fall back below when browser permissions block Clipboard API.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) throw new Error("Copy failed");

    toast.success("Đã copy mã bài test");
  } catch {
    toast.error("Không copy được mã. Hãy copy thủ công.");
  }
}

function QuizCard({ quiz, canManage = false, onDelete }) {
  const questionCount = quiz.question_count ?? 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col">
      {/* Header row */}
      <div className="flex justify-between items-center gap-3 mb-4">
        {quiz.code ? (
          <button
            type="button"
            onClick={() => copyText(quiz.code)}
            title="Click để copy mã"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-mono font-bold text-xs duration-200 flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {quiz.code}
          </button>
        ) : (
          <span className="text-xs text-gray-300 font-mono">No code</span>
        )}

        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {questionCount} câu hỏi
        </div>
      </div>

      {/* Title + description */}
      <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{quiz.title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5 line-clamp-2">
        {quiz.description || "Không có mô tả cho bài test này."}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-300 mb-4">
        {new Date(quiz.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/quiz/${quiz.id}`}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold duration-200 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Làm bài
        </Link>

        {canManage && (
          <>
            <Link
              to={`/edit/${quiz.id}`}
              className="border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-semibold duration-200"
            >
              Sửa
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(quiz)}
              className="border border-red-100 hover:bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold duration-200"
            >
              Xóa
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
