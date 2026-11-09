import { useState } from "react";

const PAGE_SIZE = 2;
const initialItems = [
  { id: 1, title: "Основы CMS" },
  { id: 2, title: "Формы React" },
  { id: 3, title: "События DOM" },
  { id: 4, title: "Методы массивов" },
  { id: 5, title: "Доступность" },
];

export default function DeletablePagination() {
  // Список и страница обновляются совместно: удаление влияет на границы.
  const [state, setState] = useState({ items: initialItems, page: 1 });
  const pageCount = Math.ceil(state.items.length / PAGE_SIZE);
  const start = (state.page - 1) * PAGE_SIZE;
  const visibleItems = state.items.slice(start, start + PAGE_SIZE);

  function removeItem(id) {
    setState((current) => {
      const items = current.items.filter((item) => item.id !== id);
      const nextPageCount = Math.ceil(items.length / PAGE_SIZE);

      // Сохраняем страницу, пока она существует.
      // Если последняя исчезла, переходим на ближайшую существующую.
      // Для пустого списка внутренний номер остаётся 1.
      const page = Math.min(current.page, Math.max(nextPageCount, 1));
      return { items, page };
    });
  }

  function changePage(delta) {
    setState((current) => {
      const count = Math.ceil(current.items.length / PAGE_SIZE);
      const page = Math.min(
        Math.max(current.page + delta, 1),
        Math.max(count, 1)
      );
      return { ...current, page };
    });
  }

  return (
    <main>
      <h1>Материалы</h1>
      <p>Всего: {state.items.length}</p>
      {state.items.length === 0 ? <p>Список пуст</p> : (
        <ul>
          {visibleItems.map((item) => (
            <li key={item.id}>
              {item.title}{" "}
              <button
                type="button"
                aria-label={"Удалить: " + item.title}
                onClick={() => removeItem(item.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      <nav aria-label="Страницы материалов">
        <button type="button" disabled={state.page <= 1} onClick={() => changePage(-1)}>
          Назад
        </button>
        <span role="status">
          Страница {pageCount === 0 ? 0 : state.page} из {pageCount}
        </span>
        <button type="button" disabled={state.page >= pageCount} onClick={() => changePage(1)}>
          Далее
        </button>
      </nav>
      <button
        type="button"
        // Исходный массив не мутировали: можно использовать его снова.
        onClick={() => setState({ items: initialItems, page: 1 })}
      >
        Восстановить список
      </button>
    </main>
  );
}
