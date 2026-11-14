import { useState } from "react";

const articles = [
  { id: 1, title: "Формы и состояние React" },
  { id: 2, title: "События JavaScript" },
  { id: 3, title: "Webflow CMS" },
  { id: 4, title: "React: компоненты" },
];

function searchArticles(items, query) {
  // \\s+ означает один или несколько пробельных символов.
  // filter убирает пустой фрагмент, возникающий при пустом запросе.
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((article) => {
    const title = article.title.toLowerCase();
    // every требует совпадения КАЖДОГО фрагмента.
    // Для пустого words возвращается true: показываем все статьи.
    return words.every((word) => title.includes(word));
  });
}

export default function WordSearch() {
  // Храним только ввод; результаты и счётчик вычисляются.
  const [query, setQuery] = useState("");
  const visible = searchArticles(articles, query);

  return (
    <main>
      <h1>Статьи</h1>
      <label htmlFor="query">Поиск по всем словам</label>
      <input
        id="query"
        type="search"
        value={query}
        aria-describedby="search-hint"
        onChange={(event) => setQuery(event.target.value)}
      />
      <p id="search-hint">
        Каждый фрагмент должен встречаться в названии. Порядок не важен.
      </p>
      <p role="status">Найдено: {visible.length}</p>
      {visible.length === 0 ? <p>Ничего не найдено</p> : (
        <ul>
          {visible.map((article) => (
            <li key={article.id}>{article.title}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
