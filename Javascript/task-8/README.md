# Подготовка тегов для CMS — JavaScript

Выпуск **2026-10-09**. Время: **20–25 минут**.

## Условие

Редактор вводит теги через запятую; перед сохранением CMS нужны единообразные уникальные значения.

### Входные данные и критерии готовности

- prepareTags(input) возвращает массив тегов в нижнем регистре.
- Убрать крайние пробелы, пустые части и повторы; сохранить порядок первого появления.
- Внутренние пробелы сохраняются. Функция чистая, без DOM.

### Крайние случаи

- "" и " , , " → [].
- "React, react, REACT" → ["react"].
- "web development,React" сохраняет внутренний пробел.

## Как рассуждать

1. **Интервьюер:** «Когда сравнивать теги на равенство?»
2. **Интервьюер:** «Как сохранить порядок и убрать повторы?»
3. **Интервьюер:** «Почему map не удаляет пустые элементы?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Сначала применю trim и toLowerCase к каждому тегу, иначе React и react окажутся разными.»

> «Пройду слева направо; добавлю тег в локальный результат, только если includes вернул false. Проверю порядок и разный регистр.»

> «map преобразует каждый элемент. Для удаления пустых строк применю filter.»

## Пошаговый разбор

1. Разделить строку через split(',').
2. Нормализовать каждый элемент через map.
3. Исключить пустые строки через filter.
4. Собрать уникальные значения через forEach и includes.
5. Вернуть локальный массив.

## Типичные ошибки

- trim всей строки не убирает пробелы вокруг каждого тега.
- Проверка повторов до нормализации сохраняет дубли.

## Альтернативный способ

Один for...of после split: нормализация, проверка непустого значения и includes внутри цикла. Меньше промежуточных массивов; цепочка методов яснее разделяет этапы.

## Ручная проверка

Проверь "  Webflow, React, , webflow, JavaScript, REACT " → ["webflow", "react", "javascript"]. Сравни обе реализации.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
// Чистая функция: строка → новый массив нормализованных тегов.
function prepareTags(input) {
  const normalizedTags = input.split(",")
    // Каждый элемент преобразуется независимо; внутренние пробелы сохраняются.
    .map((tag) => tag.trim().toLowerCase())
    // Пустые части, в том числе из пробелов, исключаются.
    .filter((tag) => tag !== "");
  const uniqueTags = [];
  normalizedTags.forEach((tag) => {
    // Мутировать новый локальный массив можно: внешние данные не затронуты.
    if (!uniqueTags.includes(tag)) uniqueTags.push(tag);
  });
  return uniqueTags;
}
// Альтернатива: те же правила в одном цикле, без map/filter.
function prepareTagsWithLoop(input) {
  const result = [];
  for (const part of input.split(",")) {
    const tag = part.trim().toLowerCase();
    if (tag !== "" && !result.includes(tag)) result.push(tag);
  }
  return result;
}
console.log(prepareTags("  Webflow, React, , webflow, JavaScript, REACT "));
console.log(prepareTags(" , , "));
console.log(prepareTagsWithLoop("web development,React,REACT"));

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Подготовка тегов</h1><p>Откройте DevTools → Console: примеры чистых функций.</p></main><script src="./script.js"></script></body>
</html>

```

</details>
