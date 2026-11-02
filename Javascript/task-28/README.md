# JavaScript: делегирование событий в карточках CMS
Выпуск: 2 ноября 2026.

## Условие
На странице есть список материалов CMS: «Основы CMS», «Формы React», «События DOM». Все изначально — черновики.
У каждой карточки две кнопки: публикация и удаление. Внутри кнопок находится span с подписью.
Кнопка «Добавить пример» добавляет черновик «Новый материал N» с растущим номером начиная с 4.
Публикация переключается локально: «Опубликовать» ↔ «Снять с публикации». Кнопка передаёт состояние через aria-pressed. Реальной записи в CMS нет.
Покажи количество материалов и сообщение пустого списка. Удаление одной карточки не затрагивает остальные.
Критерий готовности: один click-слушатель на ul обслуживает обе кнопки всех текущих и будущих карточек; индивидуальных слушателей карточкам не добавлять.
Крайние случаи: клик по span внутри кнопки; клик по заголовку ничего не делает; удалить все карточки, затем добавить новую.
Время: 25–35 минут.

## Как рассуждать
1. Чем event.target отличается от event.currentTarget?
2. Почему обработчик родителя узнает о клике по дочерней кнопке?
3. Как различить действие и найти нужную карточку?

Новый приём: делегирование использует всплытие события. Click дочернего элемента поднимается к ul. closest ищет ближайший подходящий элемент, начиная с самого target; dataset читает data-* атрибуты как строки.

## Примеры ответов вслух
«currentTarget будет ul, потому что слушатель установлен на нём. target может быть span внутри кнопки. Поэтому не буду проверять только tagName: найду кнопку через closest».
«По data-action различу publish и remove, затем найду li. Проверю, что это непосредственная карточка моего списка. Клик по обычному заголовку проигнорирую».
«Слушатель установлен на постоянном родителе. Новые карточки тоже всплывают к нему, повторно навешивать обработчики не требуется. Количество вычислю из DOM; проверю вложенный span, новые карточки и пустой список».

## Пошаговый разбор
1. Создай карточку без индивидуальных обработчиков.
2. Пометь кнопки data-action.
3. На ul добавь один click-слушатель.
4. Найди кнопку через closest и проверь принадлежность списку.
5. Найди карточку. Переключи публикацию либо удали карточку.
6. После удаления пересчитай количество; верни фокус соседней кнопке или добавлению.
7. Добавляй новые карточки той же функцией.

Ошибки: event.target.dataset.action не работает при клике на span; повторные слушатели после добавления приводят к двойным действиям; innerHTML для пользовательского текста; ручной счётчик расходится с DOM.
Проверки: span публикации переключает только свою кнопку; заголовок ничего не меняет; новая карточка реагирует сразу; удалить всё → 0 и пустое состояние; добавление после этого → 1.
Альтернатива: отдельные обработчики в createCard. Проще читать для небольшого компонента, но обработчиков больше и каждый новый способ создания карточки должен их установить. Делегирование удобно для динамического списка с общим родителем.

## Запуск
Открой index.html. Все изменения локальные, после перезагрузки список восстановится.

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
  <title>Карточки CMS</title>
</head>
<body>
  <h1>Карточки CMS</h1>
  <button id="add" type="button">Добавить пример</button>
  <p id="count" role="status"></p>
  <p id="empty" hidden>Материалов пока нет</p>
  <!-- Один обработчик списка обслужит и будущие карточки. -->
  <ul id="cards"></ul>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
const list = document.getElementById("cards");
const addButton = document.getElementById("add");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
let nextNumber = 4; // Номер растёт, даже если карточку удалили.

function updateCount() {
  // Для этой DOM-задачи список — источник текущего количества.
  // Отдельный изменяемый счётчик мог бы разойтись с интерфейсом.
  const total = list.children.length;
  count.textContent = "Материалов: " + total;
  empty.hidden = total !== 0;
}

function createCard(title) {
  const item = document.createElement("li");
  const heading = document.createElement("h2");
  // textContent выводит название как текст, а не HTML.
  heading.textContent = title;

  const publish = document.createElement("button");
  publish.type = "button";
  publish.dataset.action = "publish";
  // Нажатое состояние означает, что материал опубликован.
  publish.setAttribute("aria-pressed", "false");
  // Постоянное доступное имя toggle-кнопки; состояние задаёт aria-pressed.
  publish.setAttribute("aria-label", "Публикация материала");

  // Вложенный span нужен и для проверки event.target:
  // пользователь может нажать именно на него, а не на button.
  const publishLabel = document.createElement("span");
  publishLabel.textContent = "Опубликовать";
  publish.append(publishLabel);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.action = "remove";
  const removeLabel = document.createElement("span");
  removeLabel.textContent = "Удалить";
  remove.append(removeLabel);

  // Индивидуальных обработчиков у карточки нет.
  item.append(heading, publish, remove);
  return item;
}

list.addEventListener("click", (event) => {
  // target — элемент, по которому нажали; он может быть span.
  // closest поднимается до нужной кнопки или возвращает null.
  const button = event.target.closest("button[data-action]");
  if (!button || !list.contains(button)) return;

  const card = button.closest("li");
  // Обрабатываем только непосредственные карточки этого списка.
  if (!card || card.parentElement !== list) return;

  if (button.dataset.action === "publish") {
    const isPublished = button.getAttribute("aria-pressed") === "true";
    const nextPublished = !isPublished;
    button.setAttribute("aria-pressed", String(nextPublished));
    button.querySelector("span").textContent =
      nextPublished ? "Снять с публикации" : "Опубликовать";
  }

  if (button.dataset.action === "remove") {
    // Заранее выбираем, куда вернуть фокус после удаления кнопки.
    const neighbor = card.nextElementSibling ?? card.previousElementSibling;
    card.remove();
    (neighbor?.querySelector("button") ?? addButton).focus();
    updateCount();
  }
});

addButton.addEventListener("click", () => {
  list.append(createCard("Новый материал " + nextNumber));
  nextNumber += 1;
  updateCount();
});

// Первоначальные и новые карточки обслуживаются одним слушателем.
["Основы CMS", "Формы React", "События DOM"].forEach((title) => {
  list.append(createCard(title));
});
updateCount();
```

</details>
