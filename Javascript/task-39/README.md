# JavaScript → React: поиск по всем словам запроса
Выпуск: 13 ноября 2026.

## Условие
Статьи: 1 «Формы и состояние React», 2 «События JavaScript», 3 «Webflow CMS», 4 «React: компоненты».
Сделай живой поиск в DOM и React. Каждый непустой фрагмент запроса должен входить в название как подстрока; порядок фрагментов не важен. Регистр игнорируется, повторные пробелы/табуляции не мешают. Это поиск по фрагментам, не точное совпадение отдельных слов.
Пустой запрос показывает всё. Счётчик соответствует выдаче, при отсутствии результатов есть сообщение. Исходные данные не меняются.
Пример: "react формы" → ID1; "REACT" → ID1/4; "react cms" → пусто.
Критерии: общая чистая searchArticles(items,query), совпадение всех фрагментов через every, в React хранить только query.
Крайние случаи: пустой/пробельный запрос; несколько фрагментов в обратном порядке; один фрагмент не найден.
Время: 25–35 минут на обе версии.

## Как рассуждать — вопросы интервьюера
1. Почему includes всего запроса недостаточно?
2. Чем every отличается от some?
3. Что делать с пустым массивом фрагментов?

Новые приёмы: every проверяет, удовлетворяют ли условию все элементы. Для пустого массива возвращает true. Регулярное выражение /\s+/ в split означает «один или несколько пробельных символов».

## Примеры ответов вслух
«В строке названия фрагменты могут идти в другом порядке и не рядом. Поэтому разделю запрос и проверю каждый фрагмент отдельно».
«every означает И между условиями, some означал бы ИЛИ. По условию нужны все фрагменты. Для названия один раз выполню toLowerCase».
«trim и split дадут фрагменты, filter уберёт пустой. Пустой words с every разрешит все статьи без отдельного сброса данных».
«В React храню только query, результаты вычисляю. В DOM обновляю список отдельно от input, чтобы не терять фокус. Проверю регистр, пробелы и обратный порядок фрагментов».

## Пошаговый разбор
1. Нормализуй запрос и раздели по пробельным символам.
2. Удали пустые фрагменты.
3. Для каждой статьи нормализуй название.
4. Через every потребуй includes каждого фрагмента.
5. Выведи один результирующий массив и его длину.
6. Обработай пустую выдачу.

Ошибки: includes(query) требует соседства; some допускает только одно совпадение; обнулять исходные articles; хранить счётчик независимо от выдачи; пересоздавать input.
Ручные проверки: "" → 4; "  REACT  " → 1/4; "react формы" → 1; "формы react" → 1; "react cms" → 0; очистить → 4. Повторные пробелы и табуляция дают те же результаты.
Альтернатива: обычный цикл по фрагментам с ранним return false, если очередной отсутствует. Работает так же и удобен для пошаговой отладки; every короче выражает требование «все».

## Запуск
JavaScript: index.html. React: npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0.

[Другая реализация](../../react/task-40/).

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### index.html

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Поиск по словам</title>
</head>
<body>
  <h1>Статьи</h1>
  <label for="query">Поиск по всем словам</label>
  <input id="query" type="search" aria-describedby="search-hint">
  <p id="search-hint">Каждый фрагмент должен встречаться в названии. Порядок не важен.</p>
  <p id="count" role="status"></p>
  <p id="empty" hidden>Ничего не найдено</p>
  <ul id="articles"></ul>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
const articles = [
  { id: 1, title: "Формы и состояние React" },
  { id: 2, title: "События JavaScript" },
  { id: 3, title: "Webflow CMS" },
  { id: 4, title: "React: компоненты" },
];

function searchArticles(items, query) {
  // \\s+ означает один или несколько пробельных символов.
  // filter убирает пустой фрагмент, возникающий при пустом запросе.
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((article) => {
    const title = article.title.toLowerCase();
    // every требует совпадения КАЖДОГО фрагмента.
    // Для пустого words возвращается true: показываем все статьи.
    return words.every((word) => title.includes(word));
  });
}

const queryInput = document.getElementById("query");
const list = document.getElementById("articles");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

function render() {
  const visible = searchArticles(articles, queryInput.value);
  count.textContent = "Найдено: " + visible.length;
  empty.hidden = visible.length !== 0;
  // Поле поиска вне списка: оно не пересоздаётся при вводе.
  list.replaceChildren();

  visible.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
}

queryInput.addEventListener("input", render);
render();
```

</details>
