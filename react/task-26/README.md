# Фильтрация вместе с пагинацией — React

Выпуск **2026-10-28**. Время: 40–50 минут на обе версии.

## Условие

Каталог статей выводит по две карточки на странице. После смены категории нужно вернуться на первую страницу и пересчитать навигацию.

### Входные данные и критерии готовности

- 6 статей: 3 JavaScript, 2 React, 1 Webflow; категория CSS без материалов.
- Категории all/js/react/webflow/css; PAGE_SIZE=2.
- Сначала filter по всему набору, потом slice текущей страницы.
- Хранить category и page; выдачу, total, pageCount вычислять.
- При смене категории одновременно page=1. Кнопки не выходят за границы.
- Для пустой категории: «Ничего не найдено», Страница 0 из 0, обе кнопки disabled.
- Внутренний page — целое >=1, получаемое из событий приложения; ввод произвольного номера не требуется.

### Крайние случаи

- Третья страница всех → React с одной страницей.
- JavaScript: последняя страница из одной карточки.
- CSS: пустая выдача и заблокированные кнопки.

## Как рассуждать

- В каком порядке filter и slice?
- Почему нужен сброс страницы?
- Что хранить в React state?

Сначала предскажи результат одного действия на маленьком примере. Раздели входные данные, состояние и вычисляемые значения. Выбери метод после определения нужного преобразования.

## Примеры ответов вслух

> «Сначала фильтрую полный список, иначе на текущей странице можно получить пусто и пропустить подходящие карточки с других страниц.»

> «После сужения выдачи прежняя третья страница может не существовать. В обработчике категории обновлю её и page:1 вместе, без эффекта.»

> «Только параметры category/page. Число страниц получу через Math.ceil, карточки через slice. В JS явно render, в React setter и JSX. Проверю переход с третьей страницы на узкую категорию.»

## Пошаговый разбор

1. Подготовить каталог и PAGE_SIZE.
2. Отфильтровать исходные статьи.
3. Вычислить pageCount и безопасный currentPage.
4. Рассчитать start=(page-1)*PAGE_SIZE и slice.
5. На смене категории сбросить page.
6. На кнопках ограничивать следующий номер.
7. Вывести счётчик, пустоту и доступность навигации.

## Типичные ошибки

- slice до filter пропускает результаты.
- Не сбрасывать номер при новом фильтре.
- Хранить count/pages/visible отдельными состояниями.
- Показывать Страница 1 из 0 при пустой выдаче.

## Альтернативный способ

Можно сохранять прежний номер и ограничивать его последней существующей страницей после фильтрации. Это полезно для некоторых таблиц, но поведение менее очевидно; здесь условие требует начинать новую категорию с первой страницы.

## Ручная проверка

Все: 2/2/2 карточки, 3 страницы. С третьей выбери React → страница1 из1 и 2 карточки. JS → страницы с 2 и 1. CSS → 0 из0 и обе кнопки disabled. Исходные 6 статей сохраняются.

Другая версия: [JavaScript](../../Javascript/task-25/README.md).

## Запуск

Из папки задачи: `npm ci`, затем `npm run dev`. В Codespaces: `npm run dev -- --host 0.0.0.0`, затем Open in Browser. Сборка: `npm run build`.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### src/components/FilteredPagination.jsx

```jsx
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

```

</details>
