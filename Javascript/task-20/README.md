# Комбинированные фильтры: И и ИЛИ — JavaScript

Выпуск **2026-10-23**. Время: 25–35 минут.

## Условие

В медиацентре пользователь выбирает несколько форматов и несколько тем. Внутри группы действует ИЛИ, между группами — И.

### Входные данные и критерии готовности

- Чистая filterResources(items, filters) получает массив карточек и объект {formats, topics}.
- Пустая группа не ограничивает выдачу. Карточка подходит по теме, если хотя бы одна её тема выбрана.
- Исходные массивы и объекты не меняются; порядок результатов сохраняется.
- Для formats=['article','guide'] и topics=['js','react'] результат содержит ID 1 и 3.

### Крайние случаи

- Обе группы пусты → все карточки.
- Выбран video + js → пусто.
- У карточки несколько тем, достаточно одного совпадения.

## Как рассуждать

- Как сформулировать правило между группами?
- Как проверить пересечение тем?
- Что делать с пустой группой?

Начни с источника данных и результата одного действия. Отдели состояние от вычисляемых значений. Предскажи результат на маленьком примере до выбора метода.

## Примеры ответов вслух

> «Я вычислю matchesFormat и matchesTopic отдельно и соединю через &&. Так любой выбранный формат должен сочетаться с хотя бы одной выбранной темой.»

> «Использую item.topics.some: он вернёт true при первом совпадении с выбранными topics. includes проверит наличие конкретного кода темы.»

> «Пустая группа означает отсутствие ограничения, поэтому добавлю проверку length === 0 через ||. Проверю обе пустые группы и комбинацию без результатов.»

## Пошаговый разбор

1. Согласовать семантику И/ИЛИ до написания кода.
2. В filter вычислить совпадение формата через includes.
3. Через some проверить хотя бы одну общую тему.
4. Пустой группе дать результат true.
5. Вернуть конъюнкцию двух результатов.

## Типичные ошибки

- || между группами пропускает карточки, не удовлетворяющие одному из фильтров.
- includes на массиве массивов не проверяет пересечение.
- every потребовал бы все темы вместо одной.

## Альтернативный способ

Два последовательных filter — по формату и по темам. Они наглядно выражают И между этапами; создаётся промежуточный массив. Для небольшой выдачи выбирай по читаемости.

## Ручная проверка

Ожидаемые ID: без фильтров 1,2,3,4; article+guide и js+react → 1,3; video и js → []; topics=['webflow'] → 3,4.

## Запуск

Открой index.html. Для чистой функции смотри DevTools → Console.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### script.js

```js
const resources = [
  { id: 1, title: "Методы массивов", format: "article", topics: ["js"] },
  { id: 2, title: "Состояние React", format: "video", topics: ["react"] },
  { id: 3, title: "React в интерфейсе сайта", format: "guide", topics: ["react", "webflow"] },
  { id: 4, title: "Webflow CMS", format: "article", topics: ["webflow"] },
];

function filterResources(items, { formats = [], topics = [] } = {}) {
  // filter создаёт новый массив; исходные объекты и их topics не меняются.
  return items.filter((item) => {
    // Пустая группа не ограничивает выдачу.
    // includes реализует ИЛИ: подойдёт любой выбранный формат.
    const matchesFormat =
      formats.length === 0 || formats.includes(item.format);

    // some возвращает true, если хотя бы одна тема карточки выбрана.
    // Это также ИЛИ внутри группы тем.
    const matchesTopic =
      topics.length === 0 ||
      item.topics.some((topic) => topics.includes(topic));

    // Между разными группами действует И: пройти нужно обе проверки.
    return matchesFormat && matchesTopic;
  });
}

// Два формата + две темы → карточки 1 и 3 в исходном порядке.
console.log(filterResources(resources, {
  formats: ["article", "guide"],
  topics: ["js", "react"],
}));
// Пустые группы → все четыре; исходный resources не изменяется.
console.log(filterResources(resources));

```

### index.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JS</title><style>body{font-family:system-ui;max-width:50rem;margin:auto;padding:2rem}label{display:block;margin-top:1rem}input,select,button{font:inherit;margin:.3rem}[hidden]{display:none!important}</style></head><body><main><h1>Комбинированные фильтры</h1><p>Результаты чистой функции: DevTools → Console.</p></main><script src="./script.js"></script></body></html>

```

</details>
