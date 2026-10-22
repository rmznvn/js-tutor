# Показать ещё — JavaScript

Выпуск **2026-10-19**. Время: **35–45 минут на обе версии**.

## Условие

Список из 8 статей раскрывается порциями по 3 и сворачивается к первым трём.

### Входные данные и критерии готовности

- Показано N из M; slice для видимого массива.
- Хранить только visibleCount; ограничить Math.min длиной.
- Показать ещё пока есть скрытые.
- Свернуть доступно после раскрытия сверх первой порции, в том числе до конца списка.
- При нуле «Статей нет»; исходный массив не меняется.

### Крайние случаи

- 0 или 2 статьи.
- 8 статей, последняя порция неполная.
- Повторное раскрытие после сворачивания.

## Как рассуждать

1. **Интервьюер:** «Какое минимальное состояние?»
2. **Интервьюер:** «Зачем Math.min?»
3. **Интервьюер:** «Нужен ли массив в state?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Только число; видимые статьи получаю slice(0,count).»

> «Оно ограничивает количество длиной, поэтому будет 8 из 8, а не 9 из 8.»

> «Нет, он производный. В JS вызываю render, в React функционально обновляю count.»

## Пошаговый разбор

1. Установить min(3,length).
2. Вычислить slice.
3. Обновить список и счётчик.
4. На показ увеличить с ограничением.
5. На сворачивание вернуть начальное число.
6. Вычислить кнопки и пустоту.

## Типичные ошибки

- splice удаляет исходные данные.
- Два состояния для массива и количества.
- 3 из 0 при пустом массиве.

## Альтернативный способ

Добавлять только новые DOM-элементы экономнее для больших списков; полный render проще синхронизирует сворачивание и текущие данные.

## Ручная проверка

3 → 6 → 8 → 3; проверь массивы длиной 0 и 2.

Вторая реализация: [React](../../react/task-18/README.md).

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const ARTICLES_PER_PAGE = 3;
const articles = [
  {id:1,title:"Основы Webflow CMS"},{id:2,title:"Методы массивов"},
  {id:3,title:"Состояние в React"},{id:4,title:"Доступность форм"},
  {id:5,title:"Работа с localStorage"},{id:6,title:"Асинхронный JavaScript"},
  {id:7,title:"Оптимизация изображений"},{id:8,title:"Фильтрация карточек"},
];
let visibleCount = Math.min(ARTICLES_PER_PAGE, articles.length);
const list = document.getElementById("list");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const more = document.getElementById("more");
const collapse = document.getElementById("collapse");
function render() {
  const visible = articles.slice(0, visibleCount); // Новый массив без удаления данных.
  list.replaceChildren();
  visible.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
  count.textContent = "Показано " + visible.length + " из " + articles.length;
  empty.hidden = articles.length !== 0;
  more.hidden = visibleCount >= articles.length;
  collapse.hidden = visibleCount <= ARTICLES_PER_PAGE;
}
more.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + ARTICLES_PER_PAGE, articles.length);
  render();
});
collapse.addEventListener("click", () => {
  visibleCount = Math.min(ARTICLES_PER_PAGE, articles.length);
  render();
});
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Статьи</h1><p id="count" aria-live="polite"></p><p id="empty" hidden>Статей нет</p><ul id="list"></ul><button id="more" type="button">Показать ещё</button><button id="collapse" type="button">Свернуть список</button></main><script src="./script.js"></script></body>
</html>

```

</details>
