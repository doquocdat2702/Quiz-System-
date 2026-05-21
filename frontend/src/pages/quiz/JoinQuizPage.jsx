import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { getQuizByCode } from "../../services/authService";

function JoinQuizPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      toast.error("Vui lòng nhập mã bài test");
      return;
    }

    setLoading(true);
    try {
      const data = await getQuizByCode(cleanCode);
      navigate(`/quiz/${data.quiz.id}`);
    } catch (error) {
      toast.error(error.message || "Không tìm thấy bài test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-5 py-12">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xl mb-5">
            ID
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-950 mb-3">Nhập mã bài test</h1>
          <p className="text-gray-500 mb-6">
            Người tạo bài sẽ chia sẻ cho bạn một mã ngắn. Nhập mã đó để bắt đầu làm bài.
          </p>

          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-2xl tracking-widest font-black uppercase outline-none focus:border-blue-500 bg-slate-50"
            placeholder="ABC123"
            maxLength={12}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold shadow-sm"
          >
            {loading ? "Đang tìm..." : "ào làm bài"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default JoinQuizPage;
