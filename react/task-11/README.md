# Подтверждение удаления статьи — React

Выпуск **2026-10-12**. Время: **35–45 минут**.

## Условие

Перед удалением статьи редактор подтверждает действие в модальном окне.

### Входные данные и критерии готовности

- ArticleManager владеет статьями; ArticleList передаёт ID через callback.
- Modal принимает children для произвольного содержимого.
- Хранить только ID ожидающей удаления статьи или null; объект находить через find.
- Отмена и закрытие сохраняют список; подтверждение удаляет выбранную статью.
- После удаления последней статьи — «Статей нет».
- В архивной версии окно дополнено доступным поведением: Escape, удержание и возврат фокуса.

### Крайние случаи

- Несколько открытий и отмен.
- Удаляется только выбранная статья.
- Удаляется последняя статья.

## Как рассуждать

1. **Интервьюер:** «Почему ID, а не индекс?»
2. **Интервьюер:** «Нужен ли isModalOpen?»
3. **Интервьюер:** «Зачем children?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Индекс меняется при удалениях, ID принадлежит статье.»

> «null означает закрытие, ID — выбранную статью. Отдельный boolean мог бы противоречить ID.»

> «Modal отвечает за оболочку, родитель передаёт текст и кнопки через children. Логика удаления остаётся у владельца массива.»

## Пошаговый разбор

1. Сохранить статьи и pendingId.
2. Найти выбранный объект.
3. Открыть Modal по выбору.
4. При отмене сбросить ID.
5. При подтверждении filter и сброс ID.
6. Обработать пустое состояние.

## Типичные ошибки

- splice мутирует state.
- onClick={requestDelete(id)} вызывает функцию при рендере.
- aria-modal без поведения модального окна не обеспечивает доступность.

## Альтернативный способ

Хранить выбранный объект проще для вывода, но он может устареть после изменения массива. ID связывает окно с актуальными данными.

## Ручная проверка

Открой вторую, отмени, открой снова и удали. Проверь Escape, Tab, возврат фокуса и пустой список.

## Дополнение к примеру из чата

В исходной версии оболочка с aria-modal не обеспечивала фокус и нативную модальность. Здесь используется `<dialog>`. Callback ref — функция, которую React вызывает после присоединения DOM-узла; она вызывает `showModal()` вне render. Браузер обеспечивает Escape и ограничение фокуса; кнопки закрывают окно через `close()`, а `onClose` сбрасывает выбранный ID. Для удалённой строки её прежняя кнопка фокуса больше не существует. useEffect/useRef не требуются.

## Запуск

В терминале из этой папки:

```sh
npm ci
npm run dev
```

Сборка: `npm run build`. Это самостоятельный Vite-проект; корень репозитория не содержит общего npm-приложения.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### src/components/ArticleManager.jsx

```jsx
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

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
