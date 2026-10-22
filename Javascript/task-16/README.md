# Загрузка статей с обработкой ошибки — JavaScript

Выпуск **2026-10-19**. Время: **40–50 минут**.

## Условие

Кнопка порционно загружает статьи через имитацию Promise API; вторая страница один раз ошибается.

### Входные данные и критерии готовности

- Сначала пусто; порция 3; старые статьи сохраняются.
- isLoading защищает повторный запрос и блокирует кнопку.
- Вторая страница при первой попытке reject, затем успех.
- Ошибка даёт кнопку «Повторить»; номер страницы меняется только после успеха.
- try/catch/finally, async/await; неполная порция завершает загрузку.

### Крайние случаи

- Быстрые повторные клики.
- Ошибка и повтор той же страницы.
- Последняя порция из 2.

## Как рассуждать

1. **Интервьюер:** «Когда менять страницу?»
2. **Интервьюер:** «Как сбросить загрузку?»
3. **Интервьюер:** «Как определить конец?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «После await и успешного ответа, иначе повтор пропустит неудачную страницу.»

> «В finally: он выполняется и при успехе, и при ошибке.»

> «В этом учебном API порция меньше трёх означает конец. При кратном количестве потребуется пустой запрос, в реальном API удобен hasMore.»

## Пошаговый разбор

1. Подготовить Promise API с задержкой.
2. Хранить статьи, страницу, loading, hasMore, error.
3. До запроса защитить и поставить loading.
4. В try добавить данные и обновить страницу.
5. В catch показать ошибку.
6. В finally сбросить loading и render.

## Типичные ошибки

- Страница увеличивается до запроса.
- Старые статьи заменяются.
- loading не сбрасывается при ошибке.

## Альтернативный способ

then/catch/finally выполняют тот же сценарий; async/await удобнее для линейного чтения нескольких шагов.

## Ручная проверка

Загрузи 3 → ошибка → повтор 6 → последние 8; кнопка исчезает, дубликатов нет.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const PAGE_SIZE = 3;
const articlePages = [
  [{id:1,title:"Оптимизация изображений"},{id:2,title:"Основы React state"},{id:3,title:"Фильтрация CMS-карточек"}],
  [{id:4,title:"Работа с localStorage"},{id:5,title:"Доступные модальные окна"},{id:6,title:"Сортировка данных"}],
  [{id:7,title:"Асинхронный JavaScript"},{id:8,title:"Проверка форм"}],
];
let secondPageShouldFail = true;
function requestArticles(pageNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pageNumber === 2 && secondPageShouldFail) {
        secondPageShouldFail = false;
        reject(new Error("Учебная ошибка второй страницы."));
        return; // После reject не продолжаем обработку.
      }
      resolve(articlePages[pageNumber - 1] ?? []);
    }, 1000);
  });
}
let loadedArticles = [];
let currentPage = 0;
let isLoading = false;
let hasMore = true;
let loadError = "";
const list = document.getElementById("list");
const button = document.getElementById("load");
const errorElement = document.getElementById("error");
const statusElement = document.getElementById("status");
function render() {
  list.replaceChildren();
  loadedArticles.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
  errorElement.textContent = loadError;
  statusElement.textContent = isLoading ? "Загружаем статьи…" : "Загружено: " + loadedArticles.length;
  button.disabled = isLoading;
  button.hidden = !hasMore;
  button.textContent = isLoading ? "Загрузка…" : loadError ? "Повторить" :
    currentPage === 0 ? "Загрузить статьи" : "Загрузить ещё";
}
async function loadNextPage() {
  if (isLoading || !hasMore) return; // Защита также внутри логики.
  isLoading = true;
  loadError = "";
  render();
  const requestedPage = currentPage + 1;
  try {
    const newArticles = await requestArticles(requestedPage);
    loadedArticles = [...loadedArticles, ...newArticles];
    currentPage = requestedPage; // Только успешный ответ продвигает страницу.
    // В этом API неполная порция означает конец.
    hasMore = newArticles.length === PAGE_SIZE;
  } catch (error) {
    console.error(error);
    loadError = "Загрузка не удалась. Попробуйте ещё раз.";
  } finally {
    isLoading = false; // Обязательно и при успехе, и при исключении.
    render();
  }
}
button.addEventListener("click", loadNextPage);
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Загрузка статей</h1><p id="error" role="alert"></p><ul id="list"></ul><button id="load" type="button">Загрузить статьи</button><p id="status" role="status"></p></main><script src="./script.js"></script></body>
</html>

```

</details>
