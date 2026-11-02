import { useState } from "react";

const articles = [
  { id: 1, title: "React: состояние" },
  { id: 2, title: "Webflow CMS" },
  { id: 3, title: "React: формы" },
  { id: 4, title: "События DOM" },
];

export default function SelectVisibleArticles() {
  const [query, setQuery] = useState("");
  // Храним ID всех выбранных статей, включая временно скрытые.
  const [selectedIds, setSelectedIds] = useState([]);

  const normalizedQuery = query.trim().toLowerCase();
  const visible = articles.filter((article) =>
    article.title.toLowerCase().includes(normalizedQuery)
  );
  const visibleIds = visible.map((article) => article.id);
  const selectedVisibleCount = visibleIds.filter(
    (id) => selectedIds.includes(id)
  ).length;

  // Для пустого списка считаем «все выбраны» ложным.
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  function toggleOne(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }

  function toggleVisible() {
    if (visibleIds.length === 0) return;
    setSelectedIds((current) => {
      // Проверяем актуальное состояние внутри функционального setter.
      const allSelected =
        visibleIds.filter((id) => current.includes(id)).length ===
        visibleIds.length;

      if (allSelected) {
        // Убираем только видимые ID: скрытый выбор сохраняется.
        return current.filter((id) => !visibleIds.includes(id));
      }

      // Добавляем только недостающие ID, исключая дубликаты.
      const missingIds = visibleIds.filter((id) => !current.includes(id));
      return [...current, ...missingIds];
    });
  }

  return (
    <main>
      <h1>Выбор статей</h1>
      <label>
        Поиск по названию
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <button
        type="button"
        disabled={visible.length === 0}
        onClick={toggleVisible}
      >
        {allVisibleSelected ? "Снять выбор видимых" : "Выбрать видимые"}
      </button>

      {/* Общий и видимый выбор считаем из одного массива ID. */}
      <p role="status">
        Выбрано всего: {selectedIds.length}. Среди видимых: {selectedVisibleCount}.
      </p>

      {visible.length === 0 ? <p>Ничего не найдено</p> : (
        <ul>
          {visible.map((article) => (
            <li key={article.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(article.id)}
                  onChange={() => toggleOne(article.id)}
                />
                {article.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
