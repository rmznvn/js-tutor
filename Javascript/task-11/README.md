# История поисковых запросов — JavaScript

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

Вторая реализация: [React](../../react/task-12/README.md).

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
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
const form = document.getElementById("search-form");
const input = document.getElementById("query");
const list = document.getElementById("history");
const empty = document.getElementById("empty");
const clear = document.getElementById("clear");
let searchHistory = [];
function render() {
  list.replaceChildren(); // Старый список не должен дублироваться.
  empty.hidden = searchHistory.length !== 0;
  clear.disabled = searchHistory.length === 0;
  searchHistory.forEach((query) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const remove = document.createElement("button");
    text.textContent = query; // Строку не интерпретируем как HTML.
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.setAttribute("aria-label", "Удалить запрос " + query);
    remove.addEventListener("click", () => {
      searchHistory = removeSearchQuery(searchHistory, query);
      render();
    });
    item.append(text, " ", remove);
    list.append(item);
  });
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchHistory = addSearchQuery(searchHistory, input.value);
  input.value = "";
  input.focus();
  render();
});
clear.addEventListener("click", () => { searchHistory = []; render(); });
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>История поиска</h1><p>Учебный пример управляет историей, фактический поиск не выполняется.</p><form id="search-form"><label for="query">Запрос</label><input id="query" type="search" autocomplete="off"><button type="submit">Найти</button></form><button id="clear" type="button">Очистить историю</button><p id="empty">История пока пуста</p><ul id="history"></ul></main><script src="./script.js"></script></body>
</html>

```

</details>
