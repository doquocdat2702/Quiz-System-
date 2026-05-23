import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { getQuizForEdit, updateQuiz } from "../../services/authService";

const blankQuestion = () => ({
  question: "",
  answers: ["", "", "", ""],
  correct: "",
});

function EditQuizPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const data = await getQuizForEdit(id);
        const quiz = data.quiz;
        setTitle(quiz.title || "");
        setDescription(quiz.description || "");
        setQuestions(
          (quiz.questions || []).map((q) => ({
            question: q.question || "",
            answers: q.answers || ["", "", "", ""],
            correct: q.correct,
          }))
        );
      } catch (error) {
        toast.error(error.message || "Không tải được bài test");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, navigate]);

  const canSubmit = useMemo(() => {
    return title.trim() && questions.every((q) => (
      q.question.trim() &&
      q.answers.every((a) => String(a).trim()) &&
      q.correct !== "" &&
      q.correct !== null &&
      q.correct !== undefined
    ));
  }, [title, questions]);

  const updateQuestion = (index, field, value) => {
    setQuestions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const updateAnswer = (questionIndex, answerIndex, value) => {
    setQuestions((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== questionIndex) return item;
        return {
          ...item,
          answers: item.answers.map((answer, index) => (index === answerIndex ? value : answer)),
        };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, blankQuestion()]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.error("Bài test phải có ít nhất 1 câu hỏi");
      return;
    }
    setQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Vui lòng điền đầy đủ thông tin và đảm bảo mỗi câu hỏi có đáp án đúng");
      return;
    }

    setSaving(true);
    try {
      await updateQuiz(id, {
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q) => ({
          question: q.question.trim(),
          answers: q.answers.map((answer) => String(answer).trim()),
          correct: Number(q.correct),
        })),
      });
      toast.success("Đã cập nhật bài test");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Không cập nhật được bài test");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-10 text-center text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-5 md:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 md:p-8 text-white shadow-lg">
            <h1 className="text-3xl md:text-5xl font-black">Sửa bài test</h1>
            <p className="text-indigo-50 mt-3 text-lg">
              Cập nhật câu hỏi, đáp án và đáp án đúng của bài test.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <label className="block font-semibold text-gray-800 mb-2">Tiêu đề</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

              <label className="block font-semibold text-gray-800 mt-5 mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 min-h-24"
              />
            </section>

            {questions.map((item, questionIndex) => (
              <section key={questionIndex} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold">Câu {questionIndex + 1}</h2>
                  <button type="button" onClick={() => removeQuestion(questionIndex)} className="text-red-600 font-semibold">
                    Xóa
                  </button>
                </div>

                <input
                  value={item.question}
                  onChange={(event) => updateQuestion(questionIndex, "question", event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.answers.map((answer, answerIndex) => (
                    <label key={answerIndex} className="flex gap-3 items-center border border-gray-200 rounded-lg px-4 py-3">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={item.correct !== "" && item.correct !== null && Number(item.correct) === answerIndex}
                        onChange={() => updateQuestion(questionIndex, "correct", answerIndex)}
                        className="w-4 h-4"
                      />
                      <input
                        value={answer}
                        onChange={(event) => updateAnswer(questionIndex, answerIndex, event.target.value)}
                        className="w-full outline-none"
                      />
                      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Đúng</span>
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <button
                type="button"
                onClick={addQuestion}
                className="bg-white border border-gray-300 px-5 py-3 rounded-lg font-semibold hover:border-blue-500"
              >
                Thêm câu hỏi
              </button>

              <button
                type="submit"
                disabled={saving || !canSubmit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditQuizPage;
