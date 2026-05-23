import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { getHistory } from "../../services/authService";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setHistory(data.history || []);
      } catch (error) {
        toast.error("Lỗi khi tải lịch sử");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-5 md:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h1 className="text-3xl md:text-5xl font-black text-gray-950">Lịch sử làm bài</h1>
            <p className="text-gray-500 mt-3">Xem lại điểm và chi tiết các lần làm bài của bạn.</p>
          </div>

          {loading ? (
            <div className="text-xl text-gray-600">Đang tải...</div>
          ) : history.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-xl text-gray-600 shadow-sm">
              Bạn chưa làm bài test nào
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <Link
                  key={item.id}
                  to={`/result/${item.id}`}
                  className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">{item.quiz}</h2>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-semibold text-sm">
                          {item.code}
                        </span>
                      </div>
                      <p className="text-gray-500">
                        {new Date(item.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-4xl font-bold text-green-600">
                        {item.score}/{item.total}
                      </p>
                      <p className="text-gray-500">{item.percent || Math.round((item.score / item.total) * 100)}%</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;
