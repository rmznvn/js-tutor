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
