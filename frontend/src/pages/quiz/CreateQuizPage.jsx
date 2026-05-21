import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { createQuiz } from "../../services/authService";

const blankQuestion = () => ({
  question: "",
  answers: ["", "", "", ""],
  correct: "",
});

async function copyQuizCode(code) {
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        toast.success("Đã copy mã bài test");
        return;
      } catch {
        // Fall back below when browser permissions block Clipboard API.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) throw new Error("Copy failed");

    toast.success("Đã copy mã bài test");
  } catch {
    toast.error("Không copy được mã. Hãy copy thủ công.");
  }
}

function CreateQuizPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [createdQuiz, setCreatedQuiz] = useState(null);
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return title.trim() && questions.every((q) => (
      q.question.trim() &&
      q.answers.every((a) => a.trim()) &&
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
      toast.error("Bài test cần ít nhất 1 câu hỏi");
      return;
    }
    setQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn đáp án đúng cho mỗi câu hỏi");
      return;
    }

    setSaving(true);
    try {
      const data = await createQuiz({
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q) => ({
          question: q.question.trim(),
          answers: q.answers.map((answer) => answer.trim()),
          correct: Number(q.correct),
        })),
      });

      setCreatedQuiz(data.quiz);
      toast.success("Đã tạo bài test");
    } catch (error) {
      toast.error(error.message || "Không tạo được bài test");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-5 md:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 md:p-8 text-white shadow-lg">
            <h1 className="text-3xl md:text-5xl font-bold text-white">Tạo bài test</h1>
            <p className="text-blue-50 mt-3 text-lg">
              Sau khi tạo xong, bạn sẽ nhận được mã để người khác nhập vào làm bài.
            </p>
          </div>

          {createdQuiz && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-green-700">Mã bài test</p>
                <p className="text-4xl font-bold tracking-widest text-green-900">{createdQuiz.code}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => copyQuizCode(createdQuiz.code)}
                  className="bg-white border border-green-300 text-green-800 px-4 py-3 rounded-lg font-semibold"
                >
                  Copy ma
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/quiz/${createdQuiz.id}`)}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Mo bai test
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <label className="block font-semibold text-gray-800 mb-2">Tiêu đề</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Ví dụ: Kiểm tra React cơ bản"
              />

              <label className="block font-semibold text-gray-800 mt-5 mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 min-h-24"
                placeholder="Mô tả ngắn về bài test"
              />
            </section>

            {questions.map((item, questionIndex) => (
              <section key={questionIndex} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold">Câu {questionIndex + 1}</h2>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 font-semibold"
                  >
                    Xóa
                  </button>
                </div>

                <input
                  value={item.question}
                  onChange={(event) => updateQuestion(questionIndex, "question", event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 mb-4"
                  placeholder="Nhập nội dung câu hỏi"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.answers.map((answer, answerIndex) => (
                    <label key={answerIndex} className="flex gap-3 items-center border border-gray-200 rounded-lg px-4 py-3">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={Number(item.correct) === answerIndex}
                        onChange={() => updateQuestion(questionIndex, "correct", answerIndex)}
                        className="w-4 h-4"
                      />
                      <input
                        value={answer}
                        onChange={(event) => updateAnswer(questionIndex, answerIndex, event.target.value)}
                        className="w-full outline-none"
                        placeholder={`Đáp án ${answerIndex + 1}`}
                      />
                      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                        Đúng
                      </span>
                    </label>
                  ))}
                </div>
                {(item.correct === "" || item.correct === null || item.correct === undefined) && (
                  <p className="text-sm text-red-600 mt-3">Hãy chọn đáp án đúng cho câu này.</p>
                )}
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
                {saving ? "Đang tạo..." : "Tạo bài test"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateQuizPage;
