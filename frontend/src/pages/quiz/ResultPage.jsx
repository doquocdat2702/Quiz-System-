import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { getAttemptById } from "../../services/authService";

function ResultPage() {
  const location = useLocation();
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(location.state || null);
  const [loading, setLoading] = useState(Boolean(attemptId) && !location.state);

  useEffect(() => {
    if (!attemptId || location.state) return;

    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const data = await getAttemptById(attemptId);
        setAttempt(data.attempt);
      } catch (error) {
        toast.error(error.message || "Khong tai duoc ket qua");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId, location.state]);

  const percent = useMemo(() => {
    if (!attempt?.total) return 0;
    return Math.round((attempt.score / attempt.total) * 100);
  }, [attempt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-10 text-center text-xl text-gray-600">Dang tai ket qua...</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-10 text-center">
          <p className="text-xl text-gray-600 mb-6">Khong co du lieu ket qua</p>
          <Link to="/" className="bg-blue-600 text-white px-5 py-3 rounded-lg">
            Ve trang chu
          </Link>
        </div>
      </div>
    );
  }

  const details = attempt.details || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-5 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <p className="text-green-50 mb-2">{attempt.quiz || attempt.quizTitle || "Ket qua bai test"}</p>
            <h1 className="text-4xl md:text-5xl font-black mb-5">Ket qua</h1>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <p className="text-6xl font-black">
                {attempt.score}/{attempt.total}
              </p>
              <p className="text-2xl font-semibold text-green-50">{percent}% chinh xac</p>
            </div>
          </section>

          {details.length > 0 && (
            <div className="space-y-4">
              {details.map((item, index) => (
                <section key={item.questionId || index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold">
                      {index + 1}. {item.question}
                    </h2>
                    <span
                      className={`px-3 py-2 rounded-md font-semibold text-sm ${
                        item.isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.isCorrect ? "Dung" : "Sai"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {(item.answers || []).map((answer, answerIndex) => {
                      const isSelected = Number(item.selected) === answerIndex;
                      const isCorrect = Number(item.correct) === answerIndex;
                      return (
                        <div
                          key={answerIndex}
                          className={`border rounded-lg px-4 py-3 ${
                            isCorrect
                              ? "border-green-400 bg-green-50"
                              : isSelected
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 bg-white"
                          }`}
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + answerIndex)}.</span>
                          {answer}
                          {isCorrect && <span className="ml-2 text-green-700 font-semibold">Dap an dung</span>}
                          {isSelected && !isCorrect && <span className="ml-2 text-red-700 font-semibold">Ban chon</span>}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/" className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold">
              Ve trang chu
            </Link>
            <Link to="/history" className="bg-white border border-gray-300 text-gray-900 px-5 py-3 rounded-lg font-semibold">
              Xem lich su
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;
