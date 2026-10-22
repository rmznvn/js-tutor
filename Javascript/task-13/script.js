const COMMENT_LIMIT = 120;
function validateComment(comment) {
  const length = comment.length; // Считаем также крайние пробелы.
  if (comment.trim() === "") return { isValid: false, length, error: "Введите комментарий." };
  if (length > COMMENT_LIMIT) return {
    isValid: false, length,
    error: "Сократите комментарий на " + (length - COMMENT_LIMIT) + " симв.",
  };
  return { isValid: true, length, error: "" };
}
const form = document.getElementById("comment-form");
const input = document.getElementById("comment");
const counter = document.getElementById("counter");
const errorElement = document.getElementById("error");
const submit = document.getElementById("submit");
const statusElement = document.getElementById("status");
function render() {
  const validation = validateComment(input.value);
  counter.textContent = "Использовано: " + validation.length + " из " + COMMENT_LIMIT;
  errorElement.textContent = validation.error;
  submit.disabled = !validation.isValid;
  input.setAttribute("aria-invalid", String(!validation.isValid));
}
input.addEventListener("input", () => { statusElement.textContent = ""; render(); });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateComment(input.value).isValid) { render(); return; }
  input.value = "";
  render(); // Счётчик и кнопка соответствуют новому пустому значению.
  statusElement.textContent = "Учебный комментарий принят. Запрос на сервер не выполнялся.";
  input.focus();
});
render();
