import { Link } from "react-router-dom";
import toast from "react-hot-toast";

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Da copy ma bai test");
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

    toast.success("Da copy ma bai test");
  } catch {
    toast.error("Khong copy duoc ma. Hay copy thu cong.");
  }
}

function QuizCard({ quiz, canManage = false, onDelete }) {

  return (

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl duration-300">

      <div className="flex justify-between items-center gap-3 mb-6">

        <button
          type="button"
          onClick={() => quiz.code && copyText(quiz.code)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md font-bold text-sm duration-300"
          title="Copy ma bai test"
        >
          Code: {quiz.code || "N/A"}
        </button>

        <span className="text-gray-500 text-sm">
          {quiz.question_count || 0} cau hoi
        </span>

      </div>

      <h2 className="text-2xl font-bold mb-3 break-words">
        {quiz.title}
      </h2>

      <p className="text-gray-500 leading-7 mb-8 min-h-14">
        {quiz.description || "Khong co mo ta"}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/quiz/${quiz.id}`}
          className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-lg inline-block duration-300"
        >
          Lam bai
        </Link>

        {canManage && (
          <>
            <Link
              to={`/edit/${quiz.id}`}
              className="bg-white border border-gray-300 hover:border-blue-500 text-gray-900 px-5 py-3 rounded-lg inline-block duration-300"
            >
              Sua
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(quiz)}
              className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 px-5 py-3 rounded-lg duration-300"
            >
              Xoa
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default QuizCard;
