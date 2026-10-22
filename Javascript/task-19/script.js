const panel = document.getElementById("theme-panel");
const statusElement = document.getElementById("status");
const button = document.getElementById("toggle");
const action = document.getElementById("action");
let isDark = false;
function render() {
  panel.classList.toggle("is-dark", isDark); // Второй аргумент задаёт наличие класса.
  statusElement.textContent = isDark ? "Сейчас включена тёмная тема." : "Сейчас включена светлая тема.";
  action.textContent = isDark ? "Следующее действие: включить светлую тему." : "Следующее действие: включить тёмную тему.";
  // У toggle-кнопки сохраняем имя «Тёмная тема», меняется aria-pressed.
  button.setAttribute("aria-pressed", String(isDark));
}
button.addEventListener("click", () => { isDark = !isDark; render(); });
render();
