import { useState } from "react";
const ARTICLES_PER_PAGE = 3;
const articles = [
  {id:1,title:"Основы Webflow CMS"},{id:2,title:"Методы массивов"},
  {id:3,title:"Состояние в React"},{id:4,title:"Доступность форм"},
  {id:5,title:"Работа с localStorage"},{id:6,title:"Асинхронный JavaScript"},
  {id:7,title:"Оптимизация изображений"},{id:8,title:"Фильтрация карточек"},
];
function ArticleList({ items }) {
  return <ul>{items.map((article) => <li key={article.id}>{article.title}</li>)}</ul>;
}
export default function LoadMoreArticles() {
  const [visibleCount, setVisibleCount] = useState(Math.min(ARTICLES_PER_PAGE, articles.length));
  // Только число в state; массив каждый раз выводится из каталога.
  const visible = articles.slice(0, visibleCount);
  function showMore() {
    setVisibleCount((current) => Math.min(current + ARTICLES_PER_PAGE, articles.length));
  }
  return <main><h1>Статьи</h1>
    <p aria-live="polite">Показано {visible.length} из {articles.length}</p>
    {articles.length === 0 ? <p>Статей нет</p> : <ArticleList items={visible} />}
    {visibleCount < articles.length && <button type="button" onClick={showMore}>Показать ещё</button>}
    {visibleCount > ARTICLES_PER_PAGE && <button type="button"
      onClick={() => setVisibleCount(Math.min(ARTICLES_PER_PAGE, articles.length))}>Свернуть список</button>}
  </main>;
}
