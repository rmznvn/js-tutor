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
