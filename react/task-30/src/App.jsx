import { useState } from "react";

const questions = [
  { id: "cms", title: "Насколько уверенно работаешь с CMS?" },
  { id: "forms", title: "Насколько уверенно создаёшь формы?" },
  { id: "events", title: "Насколько уверенно работаешь с событиями?" },
];
const options = [
  { value: 0, label: "Пока не пробовала" },
  { value: 1, label: "Делаю с подсказкой" },
  { value: 2, label: "Делаю самостоятельно" },
];

function getSummary(answers) {
  // Проходим по известным вопросам, а не по произвольным ключам answers.
  return questions.reduce((summary, question) => {
    const value = answers[question.id];
    // 0 — полноценный ответ. Проверка if (value) потеряла бы его.
    const isAnswered = value !== undefined;
    return {
      answered: summary.answered + Number(isAnswered),
      score: summary.score + (value ?? 0),
    };
  }, { answered: 0, score: 0 });
}

export default function SkillsQuiz() {
  // Ответы хранятся по ID вопроса: переответ заменяет значение.
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const summary = getSummary(answers);

  function submit(event) {
    event.preventDefault();
    if (summary.answered !== questions.length) return;
    setShowResult(true);
  }

  return (
    <main>
      <h1>Самооценка навыков</h1>
      <form onSubmit={submit}>
        {questions.map((question) => (
          <fieldset key={question.id}>
            <legend>{question.title}</legend>
            {options.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  // Строгое сравнение различает 0 и отсутствие ответа.
                  checked={answers[question.id] === option.value}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    // Сохраняем другие ответы и заменяем текущий.
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: value,
                    }));
                    setShowResult(false);
                  }}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        ))}

        {/* И прогресс, и баллы вычисляются из актуальных answers. */}
        <p role="status">
          Отвечено: {summary.answered} из {questions.length}
        </p>
        <button type="submit" disabled={summary.answered !== questions.length}>
          Подвести итог
        </button>
        <button
          type="button"
          onClick={() => {
            setAnswers({}); // Controlled radio сами снимут отметки.
            setShowResult(false);
          }}
        >
          Начать заново
        </button>
        <p role="status">
          {showResult ? "Баллы самооценки: " + summary.score + " из 6" : ""}
        </p>
      </form>
    </main>
  );
}
