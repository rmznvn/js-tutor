# JavaScript → React: удаляемые чипы фильтров

Выпуск за понедельник 16 ноября 2026. Добавлен 17 ноября как пропущенный выпуск. Уровень: Junior+.

## Условие
В каталоге материалов активные фильтры показаны кнопками-чипами. Вход: UI Kit (design,free=true), Иконки (design,free=false), React-шаблон (code,free=true), ID 1–3. Поля: категория Все/design/code и checkbox «Только бесплатные». По умолчанию все три. Кнопка чипа сбрасывает только свой фильтр; исходные поля тоже должны обновиться. Счётчик и список соответствуют выбору. После удаления чипа фокус возвращается к связанному полю. Сделай DOM и React версии с одинаковой чистой filterProducts. Критерии: чипы и результаты вычисляются из двух значений, не хранятся отдельно; category=design + onlyFree=true → ID1. Время: 35–45 минут на обе версии. Крайние случаи: убрать один из двух чипов; нет активных фильтров; бесплатные + code.

## Как рассуждать — вопросы интервьюера
1. Что является источником правды для полей, чипов и списка?
2. Как удалить один фильтр и сохранить второй?
3. Что меняется при переносе из DOM в React?

## Примеры ответов вслух
«Храню category и onlyFree. Чипы и выдачу вычисляю из них: отдельное состояние чипов могло бы разойтись с полями»

«Создам новый объект через spread и заменю одно поле. Для category сброс — пустая строка, для checkbox — false. Затем проверю, что другой фильтр продолжает действовать»

«Чистая функция остаётся той же. В DOM явно синхронизирую value/checked и список; в React связываю поля со state и описываю JSX. Checkbox читаю через checked. После удаления кнопки возвращаю фокус к управлению»

## Пошаговый разбор
1. Определи объект фильтров и значения сброса каждого поля.
2. В чистой функции объедини ограничения через &&; выключенный фильтр не ограничивает выдачу.
3. В DOM обновляй состояние из change, а render синхронизирует все представления.
4. В React используй функциональное обновление объекта и controlled inputs; visible вычисляй при рендере.
5. Строй чипы только для активных фильтров; на удаление измени одно поле и верни фокус.

Типичные ошибки: Удалить чип только из DOM, сохранив фильтр; сбросить весь объект вместо одного поля; читать value у checkbox; хранить результаты независимо от filters; потерять фокус после удаления кнопки.

Ручные проверки: Старт: 3 карточки, чипов нет. Дизайн: 1/2 и один чип. Включи бесплатные: только 1 и два чипа. Удали категорию: 1/3, checkbox остаётся включённым. Удали бесплатные: все 3. Выбери code+free: только 3. Tab до чипа, Enter: чип исчезает, фокус на связанном поле.

Альтернатива: Можно описать фильтры массивом конфигурации и генерировать чипы через map. Это уменьшает повторение при множестве полей, но для двух разнородных фильтров явные условия читаются проще. DOM и React могут использовать общий модуль функции фильтрации; здесь копии сохранены ради независимого запуска примеров. Фокус через getElementById — уже знакомый приём; он выполняется в обработчике, не при рендере. Для многократно используемого React-компонента далее изучи useRef и избегай глобальных ID.

## Запуск
Открой index.html в браузере.

[Другая реализация](../../react/task-42/).

## Полный код — после самостоятельной попытки

<details><summary>Решение с комментариями</summary>

### index.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Удаляемые фильтры</title></head>
<body><main><h1>Материалы</h1>
<!-- Управление не пересоздаётся при изменении выдачи. -->
<label for="category">Категория</label><select id="category"><option value="">Все</option><option value="design">Дизайн</option><option value="code">Код</option></select>
<label><input type="checkbox" id="free"> Только бесплатные</label>
<div id="chips" aria-label="Активные фильтры"></div><p id="count" role="status"></p><ul id="products"></ul>
</main><script src="./script.js"></script></body></html>
```

### script.js

```js
const products = [
  { id: 1, title: "UI Kit", category: "design", free: true },
  { id: 2, title: "Иконки", category: "design", free: false },
  { id: 3, title: "React-шаблон", category: "code", free: true },
];

function filterProducts(items, filters) {
  // Пустая категория разрешает любую; включённый флажок требует free === true.
  // Оба ограничения должны выполняться одновременно.
  return items.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.onlyFree || item.free)
  );
}

// Храним выбранные значения, а список и чипы каждый раз вычисляем.
let filters = { category: "", onlyFree: false };
const category = document.getElementById("category");
const onlyFree = document.getElementById("free");
const chips = document.getElementById("chips");
const list = document.getElementById("products");
const count = document.getElementById("count");

function render() {
  // Обратная синхронизация нужна после удаления чипа, не только после ввода.
  category.value = filters.category;
  onlyFree.checked = filters.onlyFree;
  chips.replaceChildren();
  const active = [];
  if (filters.category) active.push({ key: "category", text: filters.category === "design" ? "Дизайн" : "Код" });
  if (filters.onlyFree) active.push({ key: "onlyFree", text: "Бесплатные" });
  active.forEach((chip) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Убрать фильтр: " + chip.text;
    button.addEventListener("click", () => {
      // Сбрасываем одно поле; spread сохраняет остальные ограничения.
      filters = { ...filters, [chip.key]: chip.key === "category" ? "" : false };
      render();
      // Удалённая кнопка больше не может держать фокус: возвращаем его к полю.
      (chip.key === "category" ? category : onlyFree).focus();
    });
    chips.append(button);
  });
  const visible = filterProducts(products, filters);
  count.textContent = visible.length ? "Найдено: " + visible.length : "Ничего не найдено";
  list.replaceChildren();
  visible.forEach((item) => {
    const li = document.createElement("li");li.textContent = item.title;list.append(li);
  });
}
category.addEventListener("change", () => { filters = { ...filters, category: category.value };render(); });
onlyFree.addEventListener("change", () => { filters = { ...filters, onlyFree: onlyFree.checked };render(); });
render();
```

</details>
