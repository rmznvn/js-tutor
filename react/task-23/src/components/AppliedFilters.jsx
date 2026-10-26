import { useState } from "react";

const articles = [
  { id: 1, title: "React: состояние", published: true },
  { id: 2, title: "Webflow CMS", published: false },
  { id: 3, title: "React: формы", published: false },
  { id: 4, title: "Доступность интерфейсов", published: true },
];
const initialFilters = { query: "", publishedOnly: false };

function filterArticles(items, filters) {
  // Нормализация запроса не меняет текст в input.
  const query = filters.query.trim().toLowerCase();
  return items.filter((article) =>
    article.title.toLowerCase().includes(query) &&
    (!filters.publishedOnly || article.published)
  );
}

export default function AppliedFilters() {
  // draft — редактируемая форма; applied — последний подтверждённый выбор.
  // Они могут различаться намеренно, поэтому нужны оба состояния.
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);

  // Результаты зависят только от applied: ввод не фильтрует список сам.
  const visibleArticles = filterArticles(articles, applied);
  const hasChanges =
    draft.query !== applied.query ||
    draft.publishedOnly !== applied.publishedOnly;

  function applyFilters(event) {
    event.preventDefault(); // Enter также применяет форму без перезагрузки.
    setApplied({ ...draft }); // Фиксируем текущий черновик.
  }

  function resetFilters() {
    // Сброс действует сразу и на форму, и на подтверждённую выдачу.
    setDraft({ ...initialFilters });
    setApplied({ ...initialFilters });
  }

  return (
    <main>
      <h1>Статьи</h1>
      <form onSubmit={applyFilters}>
        <label htmlFor="query">Поиск по названию</label>
        <input id="query" value={draft.query} onChange={(event) => {
          const query = event.target.value;
          setDraft((current) => ({ ...current, query }));
        }} />
        <label>
          <input type="checkbox" checked={draft.publishedOnly} onChange={(event) => {
            const publishedOnly = event.target.checked;
            setDraft((current) => ({ ...current, publishedOnly }));
          }} />
          Только опубликованные
        </label>
        <button type="submit" disabled={!hasChanges}>Применить</button>
        <button type="button" onClick={resetFilters}>Сбросить</button>
        {hasChanges && <p role="status">Есть неприменённые изменения.</p>}
      </form>

      {/* Счётчик выводится из той же коллекции, что и карточки. */}
      <p>Найдено: {visibleArticles.length}</p>
      {visibleArticles.length === 0 ? <p>Ничего не найдено</p> : (
        <ul>{visibleArticles.map((article) => (
          <li key={article.id}>
            {article.title} — {article.published ? "опубликовано" : "черновик"}
          </li>
        ))}</ul>
      )}
    </main>
  );
}
