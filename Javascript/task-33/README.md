# JavaScript → React: одна закреплённая статья
Выпуск: 6 ноября 2026.

## Условие
Список: ID0 «Основы CMS», ID1 «Формы React», ID2 «События DOM».
У каждой статьи кнопка «Закрепить». Изначально ничего не закреплено.
Клик выбирает статью для быстрого доступа; клик по другой заменяет выбор; повторный клик снимает. Сверху текст «Закреплено: название» либо «Ничего не закреплено».
Порядок списка не меняется; задача про единственный выбор, не перестановку. Кнопки показывают состояние через aria-pressed и сохраняют постоянное доступное имя.
Готово: сделать JS/React; хранить один pinnedId либо null; название вычислять. ID0 допустим.
Крайние случаи: закрепить ID0; переключиться 0→2; повторный клик снимает выбор и не создаёт два закрепления.
Время: 20–25 минут на обе версии.

## Как рассуждать
1. Какая структура выражает «не больше одного»?
2. Как отличить ID0 от отсутствия?
3. Как обновить интерфейс без пересоздания кнопок?

## Примеры ответов вслух
«Храню один ID или null. Массив boolean-флагов позволял бы случайно закрепить несколько статей, а здесь структура сама выражает ограничение».
«Не буду писать if(pinnedId): 0 допустим. Найду статью через find и проверю найденный объект либо сравню ID с null».
«Повторный ID заменю на null; другой ID запишу вместо прежнего. Название вычислю из массива, отдельный объект выбранной статьи хранить не нужно».
«В JS создам кнопки один раз и обновлю aria-pressed/текст статуса. В React stable key и тот же порядок сохраняют идентичность элементов. Проверю ID0, замену, снятие и клавиатуру».

## Пошаговый разбор
1. Создай pinnedId=null.
2. Отобрази неизменный список и кнопки.
3. При клике сравни ID с текущим.
4. Запиши null или новый ID.
5. Найди статью для статуса.
6. Для каждой кнопки вычисли aria-pressed сравнением ID.

Ошибки: truthy-проверка ID0; массив флагов без гарантии единственности; дублировать название в state; пересоздавать DOM-кнопки и терять фокус.
Проверки: старт → ничего; ID0 → Основы CMS, ровно одна pressed; ID2 → События DOM, первая false; повтор ID2 → ничего, все false; Tab/Enter/Space работают.
Альтернатива: нативная radio-группа для одного выбора. Она даёт стрелочную навигацию, но повторный клик по выбранной radio не снимает её — нужна отдельная очистка. Toggle-кнопки удобнее для заданного поведения «повтором открепить».

## Запуск
JavaScript: index.html. React: npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0.

[Сравнить с другой реализацией](../../react/task-34/).

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
  <title>Закреплённая статья</title>
</head>
<body>
  <h1>Быстрый доступ к статье</h1>
  <p id="pinned" role="status">Ничего не закреплено</p>
  <ul id="articles"></ul>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
const articles = [
  { id: 0, title: "Основы CMS" },
  { id: 1, title: "Формы React" },
  { id: 2, title: "События DOM" },
];

let pinnedId = null; // null — отсутствие выбора; 0 — допустимый ID.
const list = document.getElementById("articles");
const status = document.getElementById("pinned");

// Создаём кнопки один раз; при переключении они сохраняют фокус.
const controls = articles.map((article) => {
  const item = document.createElement("li");
  const title = document.createElement("span");
  title.textContent = article.title + " ";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Закрепить";
  // Постоянное имя toggle-кнопки содержит название конкретной статьи.
  button.setAttribute("aria-label", "Закрепить: " + article.title);
  button.addEventListener("click", () => {
    // Повторный клик снимает выбор; другой ID заменяет прежний.
    pinnedId = pinnedId === article.id ? null : article.id;
    render();
  });

  item.append(title, button);
  list.append(item);
  return { id: article.id, button };
});

function render() {
  // Название вычисляем из ID: отдельный объект выбранной статьи не храним.
  const pinnedArticle = articles.find((article) => article.id === pinnedId);
  status.textContent = pinnedArticle
    ? "Закреплено: " + pinnedArticle.title
    : "Ничего не закреплено";

  controls.forEach(({ id, button }) => {
    // Сравнение работает и для ID 0. Порядок карточек не меняем.
    button.setAttribute("aria-pressed", String(id === pinnedId));
  });
}
render();
```

</details>
