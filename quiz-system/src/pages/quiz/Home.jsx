import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import QuizCard from "../../components/QuizCard";
import api from "../../api/axios";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/quizzes")
      .then((res) => setQuizzes(res.data.data.quizzes))
      .catch(() => setError("Không thể tải danh sách quiz"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-[#e9eefb]">
      <Navbar />

      <div className="px-12 py-12">
        <div className="mb-16">
          <h1 className="text-7xl font-bold text-gray-900 leading-tight">
            Learn <br />
            Through Quiz 🚀
          </h1>
          <p className="text-gray-500 text-2xl mt-6 max-w-[700px] leading-10">
            Improve your programming skills with interactive quizzes and challenges.
          </p>
        </div>

        {loading && (
          <p className="text-gray-500 text-xl">Đang tải quiz...</p>
        )}

        {error && (
          <p className="text-red-500 text-xl">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-10">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
