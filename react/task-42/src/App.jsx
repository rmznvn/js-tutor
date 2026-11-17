import { useState } from "react";

const products = [
  { id: 1, title: "UI Kit", category: "design", free: true },
  { id: 2, title: "Иконки", category: "design", free: false },
  { id: 3, title: "React-шаблон", category: "code", free: true },
];

function filterProducts(items, filters) {
  // Пустая категория разрешает любую; включённый флажок требует free === true.
  // Оба ограничения должны выполняться одновременно.
  return items.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.onlyFree || item.free)
  );
}

export default function FilterChips() {
  // Только исходный выбор — state. Чипы, результаты и счётчик не дублируем.
  const [filters, setFilters] = useState({ category: "", onlyFree: false });
  const visible = filterProducts(products, filters);
  function change(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }
  function remove(field) {
    change(field, field === "category" ? "" : false);
    // Фокус — действие обработчика. Для этого учебного примера используем ID.
    // В компонентной библиотеке такие обращения обычно заменяют useRef.
    document.getElementById(field === "category" ? "category" : "free").focus();
  }
  return (
    <main>
      <h1>Материалы</h1>
      <label htmlFor="category">Категория</label>
      <select id="category" value={filters.category} onChange={(e) => change("category", e.target.value)}>
        <option value="">Все</option><option value="design">Дизайн</option><option value="code">Код</option>
      </select>
      {/* Для checkbox читаем checked, а не строковое value. */}
      <label><input id="free" type="checkbox" checked={filters.onlyFree} onChange={(e) => change("onlyFree", e.target.checked)} />Только бесплатные</label>
      <div aria-label="Активные фильтры">
        {/* После удаления чипа управляемое поле само отображает сброшенное значение. */}
        {filters.category && <button type="button" onClick={() => remove("category")}>Убрать фильтр: {filters.category === "design" ? "Дизайн" : "Код"}</button>}
        {filters.onlyFree && <button type="button" onClick={() => remove("onlyFree")}>Убрать фильтр: Бесплатные</button>}
      </div>
      <p role="status">{visible.length ? "Найдено: " + visible.length : "Ничего не найдено"}</p>
      <ul>{visible.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
    </main>
  );
}
