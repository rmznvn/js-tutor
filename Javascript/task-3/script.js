// ID из dataset — строки. null отдельно означает «всё закрыто».
const items = document.querySelectorAll("#faq [data-faq-item]");
let openId = null;

function render() {
  items.forEach((item) => {
    const isOpen = item.dataset.id === openId;
    const button = item.querySelector("button");
    // aria-controls содержит ID связанного ответа.
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(isOpen));
    answer.hidden = !isOpen;
  });
}
items.forEach((item) => {
  item.querySelector("button").addEventListener("click", () => {
    const id = item.dataset.id;
    // Повторный клик закрывает ответ, другой клик заменяет открытый ID.
    // Не используем if(openId): числовой ID 0 тоже может быть допустимым.
    openId = openId === id ? null : id;
    render();
  });
});
render();
