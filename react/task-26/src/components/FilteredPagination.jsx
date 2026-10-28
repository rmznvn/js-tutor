import { useState } from "react";

const PAGE_SIZE = 2;
const articles = [
  { id: 1, title: "Методы массивов", category: "js" },
  { id: 2, title: "Состояние React", category: "react" },
  { id: 3, title: "События DOM", category: "js" },
  { id: 4, title: "React-формы", category: "react" },
  { id: 5, title: "Webflow CMS", category: "webflow" },
  { id: 6, title: "Асинхронный JS", category: "js" },
];

function getPageData(items, category, page) {
  // Сначала фильтруем весь набор; лишь затем выбираем страницу.
  const filtered = category === "all" ? items :
    items.filter((article) => article.category === category);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  // Внутренний номер остаётся >= 1 даже при пустом наборе.
  const currentPage = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
  const start = (currentPage - 1) * PAGE_SIZE;
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    pageCount,
    currentPage,
  };
}

export default function FilteredPagination() {
  // Два связанных параметра выбора; результаты и число страниц производны.
  const [state, setState] = useState({ category: "all", page: 1 });
  const data = getPageData(articles, state.category, state.page);

  function changeCategory(event) {
    // Оба изменения происходят в событии, эффект не требуется.
    setState({ category: event.target.value, page: 1 });
  }

  function changePage(delta) {
    setState((current) => {
      const currentData = getPageData(articles, current.category, current.page);
      const page = Math.min(Math.max(currentData.currentPage + delta, 1),
        Math.max(currentData.pageCount, 1));
      return { ...current, page };
    });
  }

  return (
    <main>
      <h1>Статьи</h1>
      <label htmlFor="category">Категория</label>
      <select id="category" value={state.category} onChange={changeCategory}>
        <option value="all">Все</option>
        <option value="js">JavaScript</option>
        <option value="react">React</option>
        <option value="webflow">Webflow</option>
        <option value="css">CSS — пока нет материалов</option>
      </select>
      <p>Найдено: {data.total}</p>
      {data.total === 0 ? <p>Ничего не найдено</p> : (
        <ul>{data.items.map((article) => <li key={article.id}>{article.title}</li>)}</ul>
      )}
      <nav aria-label="Страницы статей">
        <button type="button" disabled={data.currentPage <= 1} onClick={() => changePage(-1)}>Назад</button>
        <span role="status">Страница {data.pageCount === 0 ? 0 : data.currentPage} из {data.pageCount}</span>
        <button type="button" disabled={data.currentPage >= data.pageCount} onClick={() => changePage(1)}>Далее</button>
      </nav>
    </main>
  );
}
