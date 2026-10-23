import { useState } from "react";

const initialArticles = [
  { id: 1, title: "Обзор продукта" },
  { id: 2, title: "Новости команды" },
  { id: 3, title: "Инструкция по настройке" },
];

export default function UndoableList() {
  // Список и снимок меняются вместе: объединяем их в один state.
  // null означает, что отменять нечего; [] может быть настоящим снимком.
  const [state, setState] = useState({
    items: initialArticles,
    previousItems: null,
  });

  function removeArticle(id) {
    setState((current) => {
      // Повторное удаление отсутствующего ID не перезаписывает снимок.
      if (!current.items.some((item) => item.id === id)) return current;
      return {
        // filter возвращает новый массив, не меняя предыдущий.
        items: current.items.filter((item) => item.id !== id),
        // Старый массив безопасно сохранить по ссылке:
        // мы не мутируем его и не изменяем объекты статей.
        previousItems: current.items,
      };
    });
  }

  function undo() {
    setState((current) => {
      if (current.previousItems === null) return current;
      // Восстанавливаем весь порядок и отключаем повторную отмену.
      return { items: current.previousItems, previousItems: null };
    });
  }

  return (
    <main>
      <h1>Статьи</h1>
      <p>Осталось: {state.items.length}</p>
      <button type="button" disabled={state.previousItems === null} onClick={undo}>
        Отменить последнее удаление
      </button>
      {state.items.length === 0 ? <p>Статей нет</p> : (
        <ul>
          {state.items.map((article) => (
            <li key={article.id}>
              {article.title}
              <button type="button" onClick={() => removeArticle(article.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
