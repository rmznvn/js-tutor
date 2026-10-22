# История поисковых запросов — React

Выпуск **2026-10-12**. Время: **40–50 минут на обе версии**.

## Условие

Показывать пять последних запросов; повторный запрос перемещается наверх.

### Входные данные и критерии готовности

- trim перед сохранением; пустые строки игнорировать.
- Сравнение без регистра; отображать последнее написание.
- Новый запрос первый; старый дубль удаляется; максимум 5.
- Удалять один запрос и очищать историю.
- Чистая addSearchQuery используется в обеих версиях; DOM render / React setter.
- Фактический поиск и сохранение между перезагрузками не требуются.

### Крайние случаи

- Только пробелы.
- Дубль в другом регистре.
- Шестой запрос вытесняет самый старый.

## Как рассуждать

1. **Интервьюер:** «Как сохранить регистр и сравнить без него?»
2. **Интервьюер:** «Как переместить дубль?»
3. **Интервьюер:** «Почему функциональный setter?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Сохраняю trimmed строку, для сравнения использую toLowerCase.»

> «filter уберёт прежнюю версию; spread поставит новую первой; slice(0,5) ограничит историю.»

> «Новый массив зависит от предыдущего. В JS сам вызываю render, в React setter сообщает об изменении.»

## Пошаговый разбор

1. Нормализовать новый запрос.
2. При пустом вернуть прежний массив.
3. Убрать совпадение через filter.
4. Добавить в начало и slice.
5. Реализовать удаление и очистку.
6. Связать форму и отображение.

## Типичные ошибки

- includes сравнивает с учётом регистра.
- unshift мутирует React state.
- Индекс как key нестабилен при перестановке.

## Альтернативный способ

Map может связывать нормализованную строку с отображаемой, но порядок «новые первыми» всё равно требует управления. filter + spread + slice проще для пяти элементов.

## Ручная проверка

React → Webflow → " react " даёт ["react","Webflow"]; проверь 6 уникальных, удаление и очистку.

Вторая реализация: [JavaScript](../../Javascript/task-11/README.md).

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

### src/components/SearchPage.jsx

```jsx
import { useState } from "react";
function addSearchQuery(history, query) {
  const prepared = query.trim();
  if (prepared === "") return history; // Пустой запрос не меняет историю.
  const normalized = prepared.toLowerCase();
  // Сравнение без регистра, отображение — с последним введённым регистром.
  const withoutDuplicate = history.filter((item) => item.toLowerCase() !== normalized);
  // Новая версия первая; slice возвращает максимум пять без мутации.
  return [prepared, ...withoutDuplicate].slice(0, 5);
}
function removeSearchQuery(history, query) {
  return history.filter((item) => item !== query);
}
function SearchHistory({ history, onRemove, onClear }) {
  return <section>
    <h2>Последние запросы</h2>
    <button type="button" disabled={history.length === 0} onClick={onClear}>Очистить историю</button>
    {history.length === 0 ? <p>История пока пуста</p> : <ul>
      {/* Неповторяющиеся строки подходят как key; индекс менялся бы при перестановке. */}
      {history.map((query) => <li key={query}>
        {query}<button type="button" aria-label={"Удалить запрос " + query}
          onClick={() => onRemove(query)}>Удалить</button>
      </li>)}
    </ul>}
  </section>;
}
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  function submit(event) {
    event.preventDefault();
    // Новый список зависит от предыдущего; пустой ввод функция проигнорирует.
    setHistory((current) => addSearchQuery(current, query));
    setQuery("");
  }
  return <main>
    <h1>История поиска</h1><p>Учебный пример не выполняет фактический поиск.</p>
    <form onSubmit={submit}>
      <label htmlFor="query">Запрос</label>
      <input id="query" type="search" autoComplete="off" value={query}
        onChange={(event) => setQuery(event.target.value)} />
      <button type="submit">Найти</button>
    </form>
    <SearchHistory history={history}
      onRemove={(query) => setHistory((current) => removeSearchQuery(current, query))}
      onClear={() => setHistory([])} />
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
