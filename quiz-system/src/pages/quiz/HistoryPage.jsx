function HistoryPage() {

  const history = [
    {
      id: 1,
      quiz: "React Quiz",
      score: 8
    },
    {
      id: 2,
      quiz: "JavaScript Quiz",
      score: 6
    }
  ];

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold mb-10">
        Quiz History
      </h1>

      {
        history.map((item) => (

          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl shadow-lg mb-4"
          >

            <h2 className="text-2xl font-bold">
              {item.quiz}
            </h2>

            <p className="text-gray-500 mt-2">
              Score: {item.score}
            </p>

          </div>
        ))
      }

    </div>
  );
}

export default HistoryPage;