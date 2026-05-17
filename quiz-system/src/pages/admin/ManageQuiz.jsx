import { useState } from "react";

function ManageQuiz() {

  const [quizzes, setQuizzes] =
    useState([
      {
        id: 1,
        title: "React Quiz"
      }
    ]);

  const [title, setTitle] =
    useState("");

  const createQuiz = () => {

    const newQuiz = {
      id: Date.now(),
      title
    };

    setQuizzes([
      ...quizzes,
      newQuiz
    ]);

    setTitle("");
  };

  const deleteQuiz = (id) => {

    setQuizzes(
      quizzes.filter(
        (q) => q.id !== id
      )
    );
  };

  return (

    <div className="bg-white p-8 rounded-3xl shadow-lg mt-8">

      <h2 className="text-3xl font-bold mb-6">
        Manage Quiz
      </h2>

      <div className="flex gap-4 mb-8">

        <input
          type="text"
          placeholder="Quiz title"
          className="border p-3 rounded-xl flex-1"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <button
          onClick={createQuiz}
          className="bg-blue-500 text-white px-6 rounded-xl"
        >
          Add
        </button>

      </div>

      <div className="space-y-4">

        {
          quizzes.map((quiz) => (

            <div
              key={quiz.id}
              className="flex justify-between items-center border p-4 rounded-xl"
            >

              <h3 className="text-xl">
                {quiz.title}
              </h3>

              <button
                onClick={() =>
                  deleteQuiz(quiz.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default ManageQuiz;