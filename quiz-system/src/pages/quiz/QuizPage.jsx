import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

function QuizPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then((res) => {
        const { quiz } = res.data.data;
        setQuiz(quiz);
        setQuestions(quiz.questions);
      })
      .catch(() => setError("Không thể tải quiz"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (questionId, answerIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < questions.length) {
      alert("Vui lòng trả lời tất cả câu hỏi trước khi nộp bài!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${id}/submit`, { answers: userAnswers });
      const { score, total } = res.data.data;
      navigate("/result", { state: { score, total, quizTitle: quiz?.title } });
    } catch {
      setError("Nộp bài thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-5xl font-bold mb-2">{quiz?.title}</h1>
      <p className="text-gray-500 text-lg mb-10">{quiz?.description}</p>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="bg-white p-8 rounded-3xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6">
            {qIndex + 1}. {q.question}
          </h2>
          <div className="flex flex-col gap-4">
            {q.answers.map((a, index) => (
              <button
                key={index}
                onClick={() => handleSelect(q.id, index)}
                className={`border p-4 rounded-xl text-left transition-colors duration-200 ${
                  userAnswers[q.id] === index
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-blue-50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Đang nộp bài..." : "Submit Quiz"}
      </button>
    </div>
  );
}

export default QuizPage;
