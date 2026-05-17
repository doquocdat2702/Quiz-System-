import { Link } from "react-router-dom";

function QuizCard({ quiz }) {

  return (

    <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-[35px] p-8 shadow-xl hover:-translate-y-3 hover:shadow-2xl duration-300">

      <div className="flex justify-between items-center mb-8">

        <span className="bg-blue-100 text-blue-500 px-4 py-2 rounded-2xl font-semibold">
          QUIZ
        </span>

        <span className="text-gray-400">
          10 Questions
        </span>

      </div>

      <h2 className="text-4xl font-bold mb-5">
        {quiz.title}
      </h2>

      <p className="text-gray-500 leading-8 mb-10">
        {quiz.description}
      </p>

      <Link
        to={`/quiz/${quiz.id}`}
        className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl inline-block duration-300"
      >
        Start Quiz
      </Link>

    </div>
  );
}

export default QuizCard;