import { useEffect, useState } from "react";

function ManageQuestion() {

  const [questions, setQuestions] =
    useState([]);

  const [formData, setFormData] =
    useState({
      question: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      correct: "",
      image: ""
    });

  useEffect(() => {

    const savedQuestions =
      JSON.parse(
        localStorage.getItem("questions")
      ) || [];

    setQuestions(savedQuestions);

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {

      const imageUrl =
        URL.createObjectURL(file);

      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };

  const createQuestion = () => {

    const newQuestion = {
      id: Date.now(),
      ...formData
    };

    const updatedQuestions = [
      ...questions,
      newQuestion
    ];

    setQuestions(updatedQuestions);

    localStorage.setItem(
      "questions",
      JSON.stringify(updatedQuestions)
    );

    setFormData({
      question: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      correct: "",
      image: ""
    });
  };

  const deleteQuestion = (id) => {

    const filtered =
      questions.filter(
        (q) => q.id !== id
      );

    setQuestions(filtered);

    localStorage.setItem(
      "questions",
      JSON.stringify(filtered)
    );
  };

  return (

    <div className="bg-white p-8 rounded-3xl shadow-lg mt-8">

      <h1 className="text-4xl font-bold mb-8">
        Manage Questions
      </h1>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="text"
          name="question"
          placeholder="Question"
          value={formData.question}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="text"
          name="correct"
          placeholder="Correct Answer"
          value={formData.correct}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="text"
          name="answer1"
          placeholder="Answer 1"
          value={formData.answer1}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="text"
          name="answer2"
          placeholder="Answer 2"
          value={formData.answer2}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="text"
          name="answer3"
          placeholder="Answer 3"
          value={formData.answer3}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="text"
          name="answer4"
          placeholder="Answer 4"
          value={formData.answer4}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

      </div>

      <div className="mt-6">

        <input
          type="file"
          onChange={handleImage}
        />

      </div>

      {
        formData.image && (

          <img
            src={formData.image}
            alt=""
            className="w-[200px] h-[120px] object-cover rounded-xl mt-4"
          />
        )
      }

      <button
        onClick={createQuestion}
        className="bg-blue-500 text-white px-6 py-3 rounded-xl mt-6"
      >
        Add Question
      </button>

      <div className="mt-10 space-y-6">

        {
          questions.map((q) => (

            <div
              key={q.id}
              className="border p-6 rounded-2xl"
            >

              <h2 className="text-2xl font-bold mb-4">
                {q.question}
              </h2>

              {
                q.image && (
                  <img
                    src={q.image}
                    alt=""
                    className="w-[250px] rounded-xl mb-4"
                  />
                )
              }

              <div className="space-y-2">

                <p>{q.answer1}</p>
                <p>{q.answer2}</p>
                <p>{q.answer3}</p>
                <p>{q.answer4}</p>

              </div>

              <p className="mt-4 text-green-500 font-bold">
                Correct: {q.correct}
              </p>

              <button
                onClick={() =>
                  deleteQuestion(q.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-xl mt-4"
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

export default ManageQuestion;