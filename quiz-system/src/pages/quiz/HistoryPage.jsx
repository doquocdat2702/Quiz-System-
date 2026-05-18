import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/history")
      .then((res) => setHistory(res.data.data.history))
      .catch(() => setError("Không thể tải lịch sử"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-10">
        <h1 className="text-5xl font-bold mb-10">Quiz History</h1>

        {loading && <p className="text-gray-500 text-xl">Đang tải...</p>}
        {error && <p className="text-red-500 text-xl">{error}</p>}

        {!loading && !error && history.length === 0 && (
          <p className="text-gray-400 text-xl">Bạn chưa làm quiz nào.</p>
        )}

        {history.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl shadow-lg mb-4">
            <h2 className="text-2xl font-bold">{item.quiz}</h2>
            <p className="text-gray-500 mt-2">
              Score: {item.score}/{item.total}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(item.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;
