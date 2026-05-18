import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, quizTitle } = location.state || {};

  useEffect(() => {
    if (score === undefined) navigate("/");
  }, [score, navigate]);

  const percent = total ? Math.round((score / total) * 100) : 0;
  const color = percent >= 80 ? "text-green-500" : percent >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center w-[500px]">
        <h1 className="text-5xl font-bold mb-2">Kết quả</h1>
        {quizTitle && <p className="text-gray-500 text-lg mb-8">{quizTitle}</p>}

        <p className={`text-7xl font-bold mb-2 ${color}`}>{score}/{total}</p>
        <p className={`text-2xl font-semibold mb-8 ${color}`}>{percent}%</p>

        <p className="text-gray-500 mb-8">
          {percent >= 80 ? "Xuất sắc! 🎉" : percent >= 50 ? "Khá tốt! 👍" : "Cố gắng hơn nhé! 💪"}
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600">
            Về trang chủ
          </Link>
          <Link to="/history" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300">
            Xem lịch sử
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
