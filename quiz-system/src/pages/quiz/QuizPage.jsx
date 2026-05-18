import { useNavigate } from "react-router-dom";
import { useState } from "react";

function QuizPage() {

  const navigate = useNavigate();

  const [questions] = useState([
    {
      id: 1,
      question: "React là gì?",
      answers: [
        "Framework",
        "Library",
        "Database"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "JSX dùng để làm gì?",
      answers: [
        "UI",
        "Server",
        "Database"
      ],
      correct: 0
    }
  ]);

  const [userAnswers, setUserAnswers] =
    useState({});

  const handleSelect = (
    questionId,
    answerIndex
  ) => {

    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    });
  };

  const handleSubmit = () => {

    let score = 0;

    questions.forEach((q) => {

      if (
        userAnswers[q.id] === q.correct
      ) {
        score++;
      }
    });

    navigate("/result", {
      state: {
        score,
        total: questions.length
      }
    });
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold mb-10">
        Quiz Page
      </h1>

      {
        questions.map((q) => (

          <div
            key={q.id}
            className="bg-white p-8 rounded-3xl shadow-lg mb-6"
          >

            <h2 className="text-2xl font-bold mb-6">
              {q.question}
            </h2>

            <div className="flex flex-col gap-4">

              {
                q.answers.map((a, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      handleSelect(q.id, index)
                    }
                    className="border p-4 rounded-xl hover:bg-blue-500 hover:text-white"
                  >
                    {a}
                  </button>
                ))
              }

            </div>

          </div>
        ))
      }

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-8 py-4 rounded-xl"
      >
        Submit Quiz
      </button>

    </div>
  );
}

export default QuizPage;