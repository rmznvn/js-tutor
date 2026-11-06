import { useState } from "react";

const articles = [
  { id: 0, title: "Основы CMS" },
  { id: 1, title: "Формы React" },
  { id: 2, title: "События DOM" },
];

export default function PinnedArticle() {
  // Один ID выражает правило «не больше одной закреплённой статьи».
  const [pinnedId, setPinnedId] = useState(null);
  const pinnedArticle = articles.find((article) => article.id === pinnedId);

  return (
    <main>
      <h1>Быстрый доступ к статье</h1>
      {/* Проверяем найденный объект, не truthy/falsy самого ID. */}
      <p role="status">
        {pinnedArticle
          ? "Закреплено: " + pinnedArticle.title
          : "Ничего не закреплено"}
      </p>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            {article.title}{" "}
            <button
              type="button"
              aria-label={"Закрепить: " + article.title}
              aria-pressed={pinnedId === article.id}
              onClick={() => {
                // Предыдущий выбор сравниваем внутри функционального setter.
                setPinnedId((current) =>
                  current === article.id ? null : article.id
                );
              }}
            >
              {/* Имя остаётся постоянным; состояние передаёт aria-pressed. */}
              Закрепить
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
