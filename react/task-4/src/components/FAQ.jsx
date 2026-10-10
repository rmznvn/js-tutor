import { useState } from "react";

const questions = [
  { id: 0, title: "Есть ли демоверсия?", answer: "Да, по заявке." },
  { id: 1, title: "Можно ли работать командой?", answer: "Да." },
];
export default function FAQ() {
  // null обозначает отсутствие открытого ответа; ID 0 остаётся допустимым.
  const [openId, setOpenId] = useState(null);
  function toggleQuestion(id) {
    // Совпадение закрывает, другой ID открывает соответствующий ответ.
    setOpenId((currentId) => currentId === id ? null : id);
  }
  return (
    <section>
      <h1>Частые вопросы</h1>
      {questions.map((question) => {
        const isOpen = openId === question.id;
        const answerId = `answer-${question.id}`;
        return (
          <div key={question.id}>
            <h2>
              <button type="button" aria-expanded={isOpen} aria-controls={answerId}
                onClick={() => toggleQuestion(question.id)}>{question.title}</button>
            </h2>
            {/* React сам обновляет hidden на основе нового состояния. */}
            <div id={answerId} hidden={!isOpen}><p>{question.answer}</p></div>
          </div>
        );
      })}
    </section>
  );
}
