import AdminLayout from "../../layouts/AdminLayout";

function Dashboard() {

  const cards = [
    {
      title: "Users",
      value: "120",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Quizzes",
      value: "35",
      color: "from-green-500 to-emerald-400"
    },
    {
      title: "Results",
      value: "500",
      color: "from-pink-500 to-red-400"
    }
  ];

  return (

    <AdminLayout>

      <div className="mb-12">

        <h1 className="text-6xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 text-xl mt-4">
          Welcome back Admin 👋
        </p>

      </div>

      <div className="grid grid-cols-3 gap-8">

        {
          cards.map((card, index) => (

            <div
              key={index}
              className={`bg-gradient-to-r ${card.color} p-8 rounded-[32px] shadow-2xl text-white hover:scale-105 duration-300`}
            >

              <h2 className="text-2xl">
                {card.title}
              </h2>

              <p className="text-7xl font-bold mt-8">
                {card.value}
              </p>

            </div>
          ))
        }

      </div>

    </AdminLayout>
  );
}

export default Dashboard;