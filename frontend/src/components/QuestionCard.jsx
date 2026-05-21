function QuestionCard({
  question,
  onSelect
}) {

  return (
    <div className="card">

      <h3>{question.question}</h3>

      {
        question.answers.map((a, index) => (

          <button
            key={index}
            onClick={() =>
              onSelect(question.id, index)
            }
          >
            {a}
          </button>
        ))
      }

    </div>
  );
}

export default QuestionCard;