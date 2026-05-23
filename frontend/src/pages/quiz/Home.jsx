import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import QuizCard from "../../components/QuizCard";
import { deleteQuiz, getQuizzes } from "../../services/authService";
import { AuthContext } from "../../context/auth-context";

function Home() {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách bài test");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quiz) => {
    const ok = window.confirm(`Xóa bài test "${quiz.title}"? Hành động này không thể hoàn tác!`);
    if (!ok) return;

    try {
      await deleteQuiz(quiz.id);
      setQuizzes((current) => current.filter((item) => item.id !== quiz.id));
      toast.success("Đã xóa bài test");
    } catch (error) {
      toast.error(error.message || "Không xóa được bài test");
    }
  };

  const filtered = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      (q.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="px-5 md:px-10 py-8">
        {/* Hero banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-800 p-6 md:p-10 text-white shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent)] pointer-events-none" />
          <div className="relative">
            <p className="text-blue-300 font-semibold text-sm mb-2 uppercase tracking-wide">Quiz System</p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              Kiểm tra kiến thức<br className="hidden md:block" /> của bạn
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Tạo bài test và thi thử online miễn phí. Theo dõi kết quả và lịch sử làm bài dễ dàng.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/join"
                className="bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 duration-200 text-sm shadow"
              >
                Nhập mã bài
              </Link>
              <Link
                to="/create"
                className="bg-cyan-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 duration-200 text-sm shadow"
              >
                + Tạo bài test
              </Link>
            </div>
          </div>
        </div>

        {/* Search + stats row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm bài test..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-sm transition"
            />
          </div>
          <p className="text-sm text-gray-400 shrink-0">
            {loading ? "Đang tải..." : `${filtered.length} bài test`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded mb-3 w-1/3" />
                <div className="h-6 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
                <div className="h-4 bg-gray-100 rounded mb-6 w-2/3" />
                <div className="h-10 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {search ? "Không tìm thấy bài test nào" : "Chưa có bài test nào"}
            </h2>
            <p className="text-gray-400 mb-6">
              {search ? "Thử tìm kiếm với từ khóa khác" : "Hãy tạo bài test đầu tiên hoặc nhập mã bài."}
            </p>
            {!search && (
              <Link
                to="/create"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 duration-200 text-sm"
              >
                Tạo bài test đầu tiên
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                canManage={user?.id != null && Number(quiz.created_by) === Number(user.id)}
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
