import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import QuizCard from "../../components/QuizCard";
import { deleteQuiz, getQuizzes } from "../../services/authService";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        toast.error("Loi khi tai danh sach bai test");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quiz) => {
    const ok = window.confirm(`Xoa bai test "${quiz.title}"? Hanh dong nay khong the hoan tac.`);
    if (!ok) return;

    try {
      await deleteQuiz(quiz.id);
      setQuizzes((current) => current.filter((item) => item.id !== quiz.id));
      toast.success("Da xoa bai test");
    } catch (error) {
      toast.error(error.message || "Khong xoa duoc bai test");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="px-5 md:px-12 py-10">
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-blue-600 p-6 md:p-8 text-white shadow-lg flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Quiz System
            </h1>
            <p className="text-blue-50 text-lg md:text-xl mt-4 max-w-[720px] leading-8">
              Tao bai test, chia se ma cho ban be, lam bai va xem lai ket qua cua minh.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/join"
              className="bg-white text-gray-950 px-5 py-3 rounded-lg font-bold hover:bg-blue-50 duration-300"
            >
              Nhap ma bai
            </Link>
            <Link
              to="/create"
              className="bg-cyan-400 text-slate-950 px-5 py-3 rounded-lg font-bold hover:bg-cyan-300 duration-300"
            >
              Tao bai test
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-xl text-gray-600">Dang tai...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center text-xl text-gray-600">Chua co bai test nao</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                canManage
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
