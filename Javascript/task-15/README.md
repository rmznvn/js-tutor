# Фильтрация и склонение счётчика — JavaScript

Выпуск **2026-10-16**. Время: **35–45 минут на обе версии**.

## Условие

Каталог объектов фильтруется по статусу; счётчик говорит «1 объект», «2 объекта», «5 объектов».

### Входные данные и критерии готовности

- Все / published / draft. Объекты: ЖК, Бизнес-центр, Завод, Склад, Школа.
- Сначала проверить последние две цифры 11–14, затем последнюю: 1 / 2–4 / остальные.
- Счётчик из отфильтрованного массива; при нуле пустое состояние.
- Общая чистая функция склонения; исходные данные не мутируются.
- Контракт склонения: неотрицательное целое количество из .length.

### Крайние случаи

- 0, 1, 2, 4, 5.
- 11, 14, 21, 22, 25.
- 111, 112; пустой каталог.

## Как рассуждать

1. **Интервьюер:** «Почему недостаточно последней цифры?»
2. **Интервьюер:** «Что хранить?»
3. **Интервьюер:** «Как получить число?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «11 заканчивается на 1, но требует объектов. Сначала проверю count % 100 в диапазоне 11–14.»

> «Только выбранный статус. Список, count и слово вычисляются.»

> «После filter возьму length. В JS вручную render, в React setter и JSX; проверю 11 и 21 отдельно.»

## Пошаговый разбор

1. Реализовать getObjectWord.
2. Реализовать filterProjects.
3. Обработать select.
4. Вывести count и слово.
5. Показать карточки и пустое состояние.

## Типичные ошибки

- Последняя цифра проверяется раньше 11–14.
- Отдельный state счётчика.
- Округлять дробь и называть это корректным склонением дробных чисел.

## Альтернативный способ

Intl.PluralRules('ru-RU') выбирает грамматическую категорию; нужно сопоставить её словам. Удобно для локализации, ручной алгоритм яснее объясняет правило.

## Ручная проверка

Прогони весь набор 0,1,2,4,5,11,14,21,22,25,111,112; проверь 3 опубликованных и 2 черновика.

Вторая реализация: [React](../../react/task-16/README.md).

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const projects = [
  { id: 1, title: "Жилой комплекс", status: "published" },
  { id: 2, title: "Бизнес-центр", status: "draft" },
  { id: 3, title: "Завод", status: "published" },
  { id: 4, title: "Складской комплекс", status: "draft" },
  { id: 5, title: "Школа", status: "published" },
];
// Контракт функции: неотрицательное целое count, например array.length.
// Для дробных количеств правила склонения другие.
function getObjectWord(count) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "объектов";
  const last = count % 10;
  if (last === 1) return "объект";
  if (last >= 2 && last <= 4) return "объекта";
  return "объектов";
}
function filterProjects(items, status) {
  return status === "all" ? [...items] : items.filter((item) => item.status === status);
}
const filter = document.getElementById("filter");
const countElement = document.getElementById("count");
const empty = document.getElementById("empty");
const list = document.getElementById("list");
let selectedStatus = "all";
function render() {
  const visible = filterProjects(projects, selectedStatus);
  countElement.textContent = visible.length + " " + getObjectWord(visible.length);
  empty.hidden = visible.length !== 0;
  list.replaceChildren();
  visible.forEach((project) => {
    const item = document.createElement("li");
    item.textContent = project.title + (project.status === "published" ? " — опубликован" : " — черновик");
    list.append(item);
  });
}
filter.addEventListener("change", (event) => { selectedStatus = event.target.value; render(); });
render();
[0,1,2,4,5,11,14,21,22,25,111,112].forEach((count) => console.log(count, getObjectWord(count)));

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Объекты</h1><label for="filter">Статус</label><select id="filter"><option value="all">Все</option><option value="published">Опубликованные</option><option value="draft">Черновики</option></select><p id="count" aria-live="polite"></p><p id="empty" hidden>Ничего не найдено</p><ul id="list"></ul></main><script src="./script.js"></script></body>
</html>

```

</details>
