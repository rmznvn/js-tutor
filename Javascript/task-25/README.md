# Фильтрация вместе с пагинацией — JavaScript

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

Другая версия: [React](../../react/task-26/README.md).

## Запуск

Открой index.html. Примеры чистой функции находятся в DevTools → Console.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### script.js

```js
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

let state = { category: "all", page: 1 };
const categorySelect = document.getElementById("category");
const list = document.getElementById("list");
const total = document.getElementById("total");
const pageInfo = document.getElementById("page-info");
const empty = document.getElementById("empty");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

function render() {
  const data = getPageData(articles, state.category, state.page);
  categorySelect.value = state.category;
  total.textContent = "Найдено: " + data.total;
  // Для пустого набора честно отображаем 0 из 0.
  pageInfo.textContent = "Страница " + (data.pageCount === 0 ? 0 : data.currentPage) +
    " из " + data.pageCount;
  empty.hidden = data.total !== 0;
  previous.disabled = data.currentPage <= 1;
  next.disabled = data.currentPage >= data.pageCount;
  list.replaceChildren();
  data.items.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
}

categorySelect.addEventListener("change", (event) => {
  // Новый фильтр может сократить число страниц: начинаем с первой.
  state = { category: event.target.value, page: 1 };
  render();
});

function changePage(delta) {
  const data = getPageData(articles, state.category, state.page);
  const page = Math.min(Math.max(data.currentPage + delta, 1), Math.max(data.pageCount, 1));
  state = { ...state, page };
  render();
}
previous.addEventListener("click", () => changePage(-1));
next.addEventListener("click", () => changePage(1));
render();

```

### index.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Фильтрация и пагинация</title><style>body{font-family:system-ui;max-width:50rem;margin:auto;padding:2rem}button,select{font:inherit;margin:.4rem}[hidden]{display:none!important}</style></head><body><main><h1>Статьи</h1><label for="category">Категория</label><select id="category"><option value="all">Все</option><option value="js">JavaScript</option><option value="react">React</option><option value="webflow">Webflow</option><option value="css">CSS — пока нет материалов</option></select><p id="total"></p><p id="empty" hidden>Ничего не найдено</p><ul id="list"></ul><nav aria-label="Страницы статей"><button id="previous" type="button">Назад</button><span id="page-info" role="status"></span><button id="next" type="button">Далее</button></nav></main><script src="./script.js"></script></body></html>

```

</details>
