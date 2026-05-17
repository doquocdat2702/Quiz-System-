import { Link, useLocation } from "react-router-dom";

function ResultPage() {

  const location = useLocation();

  const { score, total } =
    location.state || {};

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center w-[500px]">

        <h1 className="text-5xl font-bold mb-8">
          Result
        </h1>

        <p className="text-6xl font-bold text-green-500 mb-8">
          {score} / {total}
        </p>

        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-xl"
        >
          Back Home
        </Link>

      </div>

    </div>
  );
}

export default ResultPage;