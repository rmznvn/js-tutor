const stars = document.getElementById("stars");
const chosen = document.getElementById("chosen");
const clearButton = document.getElementById("clear");
let rating = 0; // Ноль означает, что оценка ещё не выбрана.
let preview = null; // null означает отсутствие временного предпросмотра.

// Кнопки создаём один раз: render меняет свойства и не теряет фокус.
for (let score = 1; score <= 5; score += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "★";
  button.dataset.score = String(score);
  button.setAttribute("aria-label", "Оценить на " + score + " из 5");
  button.addEventListener("mouseenter", () => { preview = score; render(); });
  button.addEventListener("focus", () => { preview = score; render(); });
  button.addEventListener("blur", () => { preview = null; render(); });
  button.addEventListener("click", () => {
    rating = score; // Только подтверждённое действие сохраняет оценку.
    preview = null;
    render();
  });
  stars.append(button);
}

function render() {
  // ?? использует выбранную оценку только при отсутствии предпросмотра.
  const visibleRating = preview ?? rating;
  stars.querySelectorAll("button").forEach((button) => {
    const score = Number(button.dataset.score);
    button.classList.toggle("is-filled", score <= visibleRating);
    // Нажатой считается ровно выбранная оценка, а не все подсвеченные звёзды.
    button.setAttribute("aria-pressed", String(score === rating));
  });
  chosen.textContent = rating === 0 ? "Оценка не выбрана" : "Ваша оценка: " + rating + " из 5";
  clearButton.disabled = rating === 0;
}

stars.addEventListener("mouseleave", () => { preview = null; render(); });
clearButton.addEventListener("click", () => {
  rating = 0;
  preview = null;
  render();
});
render();
