import Navbar from "../../components/Navbar";
import QuizCard from "../../components/QuizCard";

function Home() {

  const quizzes = [
    {
      id: 1,
      title: "React Quiz",
      description: "Master React fundamentals"
    },
    {
      id: 2,
      title: "JavaScript Quiz",
      description: "Test your JS skills"
    },
    {
      id: 3,
      title: "HTML & CSS Quiz",
      description: "Frontend basics"
    }
  ];

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

        <div className="grid grid-cols-3 gap-10">

          {
            quizzes.map((quiz) => (

              <QuizCard
                key={quiz.id}
                quiz={quiz}
              />

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Home;