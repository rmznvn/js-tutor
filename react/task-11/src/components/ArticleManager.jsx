import { useState } from "react";
const initialArticles = [
  {id:1,title:"Как подготовить сайт к публикации"},
  {id:2,title:"Оптимизация изображений в Webflow"},
  {id:3,title:"Основы состояния в React"},
];
// Новый приём: callback ref получает DOM-узел ПОСЛЕ его добавления.
// showModal включает нативную модальность, фокус и Escape, без useEffect/useRef.
function Modal({ title, onClose, onConfirm, children }) {
  function openDialog(node) {
    if (node && !node.open) node.showModal();
  }
  function closeDialog(event) {
    // close возвращает фокус к элементу, открывшему окно, если он ещё существует.
    event.currentTarget.closest("dialog").close();
  }
  return <dialog ref={openDialog} onClose={onClose} aria-labelledby="modal-title">
    <h2 id="modal-title">{title}</h2>
    <button type="button" aria-label="Закрыть окно" onClick={closeDialog}>×</button>
    {children}
    <button type="button" autoFocus onClick={closeDialog}>Отмена</button>
    <button type="button" onClick={(event) => {
      closeDialog(event); // Нативно закрываем перед удалением строки.
      onConfirm();
    }}>Удалить</button>
  </dialog>;
}
function ArticleList({ articles, onRequestDelete }) {
  return <ul>{articles.map((article) => <li key={article.id}>
    {article.title}
    <button type="button" onClick={() => onRequestDelete(article.id)}>Удалить</button>
  </li>)}</ul>;
}
export default function ArticleManager() {
  const [articles, setArticles] = useState(initialArticles);
  // null = закрыто; ID = ожидаем подтверждения, отдельный isOpen не нужен.
  const [pendingId, setPendingId] = useState(null);
  const pendingArticle = articles.find((article) => article.id === pendingId);
  function confirmDelete() {
    if (pendingId === null) return;
    setArticles((current) => current.filter((article) => article.id !== pendingId));
    setPendingId(null);
  }
  return <main>
    <h1>Управление статьями</h1>
    {articles.length === 0 ? <p>Статей нет</p> :
      <ArticleList articles={articles} onRequestDelete={setPendingId} />}
    {pendingArticle && <Modal title="Удалить статью?" onClose={() => setPendingId(null)}
      onConfirm={confirmDelete}>
      {/* children сохраняет содержимое окна под контролем родителя. */}
      <p>Вы действительно хотите удалить статью «{pendingArticle.title}»?</p>
    </Modal>}
  </main>;
}
