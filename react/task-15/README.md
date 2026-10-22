# Редактирование категорий CMS — React

Выпуск **2026-10-16**. Время: **35–45 минут**.

## Условие

Редактор меняет название одной категории за раз и может удалить категорию.

### Входные данные и критерии готовности

- Категории Webflow, JavaScript, React.
- editingId и draftTitle; при старте заполнить черновик текущим названием.
- Сохранить — trim и map; отмена не меняет настоящие данные.
- Пустое название и дубль без регистра запрещены; собственное название не дубль.
- При удалении редактируемой строки сбросить редактор.
- Счётчик из categories.length; key по ID.

### Крайние случаи

- Только пробелы.
- Переименование Webflow в react.
- Отмена или удаление редактируемой категории.

## Как рассуждать

1. **Интервьюер:** «Зачем отдельный черновик?»
2. **Интервьюер:** «Как искать дубли?»
3. **Интервьюер:** «Где хранить ошибку?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Изменяю input независимо от категории, поэтому отмена просто выбрасывает черновик.»

> «Нормализую trim/toLowerCase и исключаю текущий ID. some возвращает true при первом совпадении.»

> «Ошибка производна от категорий, ID и черновика. Для state она не нужна; сохранение защищу и в обработчике.»

## Пошаговый разбор

1. Создать три состояния.
2. При старте скопировать название.
3. Вычислить ошибку.
4. При сохранении map и spread.
5. При отмене сбросить редактор.
6. При удалении filter и при необходимости сброс.

## Типичные ошибки

- category.title = ... мутирует объект.
- Собственное название ошибочно считается дублем.
- Черновик не сбрасывается.

## Альтернативный способ

Черновик в компоненте строки сокращает родителя, но правило единственной редактируемой строки всё равно требует активного ID у общего родителя.

## Ручная проверка

Переименуй JavaScript, отмени React, попробуй пробелы и дубль; удали активную строку.

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

### src/components/CategoryManager.jsx

```jsx
import { useState } from "react";
const initialCategories = [
  {id:1,title:"Webflow"},{id:2,title:"JavaScript"},{id:3,title:"React"},
];
function getTitleError(categories, editingId, draftTitle) {
  const prepared = draftTitle.trim();
  if (prepared === "") return "Название категории обязательно.";
  // some возвращает true, если найден хотя бы один дубль; текущий ID исключён.
  const duplicate = categories.some((category) =>
    category.id !== editingId && category.title.trim().toLowerCase() === prepared.toLowerCase());
  return duplicate ? "Категория с таким названием уже существует." : "";
}
function CategoryItem({ category, isEditing, draftTitle, error, onDraft, onStart, onSave, onCancel, onDelete }) {
  return <li>{isEditing ? <div>
    <label htmlFor={"category-" + category.id}>Название категории</label>
    <input id={"category-" + category.id} value={draftTitle}
      onChange={(event) => onDraft(event.target.value)} aria-invalid={Boolean(error)}
      aria-describedby={error ? "category-error" : undefined} />
    {error && <p id="category-error" role="alert">{error}</p>}
    <button type="button" disabled={Boolean(error)} onClick={onSave}>Сохранить</button>
    <button type="button" onClick={onCancel}>Отмена</button>
  </div> : <div>{category.title}
    <button type="button" onClick={() => onStart(category)}>Редактировать</button>
  </div>}
    {/* Удаление остаётся доступным и у редактируемой строки. */}
    <button type="button" onClick={() => onDelete(category.id)}>Удалить</button>
  </li>;
}
export default function CategoryManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const error = editingId === null ? "" : getTitleError(categories, editingId, draftTitle);
  function cancel() { setEditingId(null); setDraftTitle(""); }
  function start(category) {
    setEditingId(category.id);
    setDraftTitle(category.title); // Черновик отделён от настоящего объекта.
  }
  function save() {
    if (editingId === null || error) return;
    const title = draftTitle.trim();
    setCategories((current) => current.map((category) =>
      category.id === editingId ? {...category, title} : category));
    cancel();
  }
  function remove(id) {
    setCategories((current) => current.filter((category) => category.id !== id));
    if (editingId === id) cancel();
  }
  return <main><h1>Категории CMS</h1><p>Всего категорий: {categories.length}</p>
    {categories.length === 0 ? <p>Категорий пока нет.</p> : <ul>
      {categories.map((category) => <CategoryItem key={category.id} category={category}
        isEditing={category.id === editingId} draftTitle={draftTitle}
        error={category.id === editingId ? error : ""}
        onDraft={setDraftTitle} onStart={start} onSave={save} onCancel={cancel} onDelete={remove} />)}
    </ul>}
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
