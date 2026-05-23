import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { getQuizById, submitQuiz } from "../../services/authService";

function QuizPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizById(id);
        setQuiz(data.quiz || data);
      } catch (error) {
        toast.error("Không tải được bài test");
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleSelect = (questionId, answerIndex) => {
    setUserAnswers((current) => ({
      ...current,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    const questions = quiz?.questions || [];
    const answeredCount = Object.keys(userAnswers).length;

    if (answeredCount !== questions.length) {
      toast.error("Vui lòng trả lời tất cả các câu hỏi");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitQuiz(id, userAnswers);
      navigate(`/result/${result.attemptId}`, {
        state: result,
      });
    } catch (error) {
      toast.error(error.message || "Lỗi khi nộp bài");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Không tìm thấy bài test</div>
      </div>
    );
  }

  const questions = quiz.questions || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-5 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md font-bold">
                Code: {quiz.code}
              </span>
              <span className="text-gray-500">{questions.length} câu hỏi</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-3 text-gray-950">{quiz.title}</h1>
            <p className="text-gray-600 text-lg">{quiz.description}</p>
          </div>

          {questions.map((q, qIndex) => (
            <section key={q.id} className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-sm mb-5">
              <h2 className="text-xl md:text-2xl font-bold mb-5">
                {qIndex + 1}. {q.question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {q.answers.map((answer, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(q.id, index)}
                    className={`text-left border-2 p-4 rounded-xl transition-all ${
                      userAnswers[q.id] === index
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-200 hover:border-blue-500"
                    }`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-0 bg-slate-50/95 py-4 border-t border-gray-200 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-gray-600">
                Đã trả lời {Object.keys(userAnswers).length}/{questions.length} câu
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-sm"
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizPage;
