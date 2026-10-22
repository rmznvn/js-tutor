const textElement = document.getElementById("article-text");
const button = document.getElementById("read-more");
const limit = 100;
// Сохраняем оригинал ДО сокращения: DOM далее содержит только представление.
const fullText = textElement.textContent;
const needsTruncation = fullText.length > limit;
let expanded = false;
function render() {
  // slice не меняет исходную строку; пустой и короткий текст не сокращаются.
  textElement.textContent = needsTruncation && !expanded
    ? fullText.slice(0, limit) + "…" : fullText;
  button.hidden = !needsTruncation;
  button.textContent = expanded ? "Свернуть" : "Читать дальше";
  button.setAttribute("aria-expanded", String(expanded));
}
button.addEventListener("click", () => {
  expanded = !expanded;
  render(); // Обычная переменная не обновляет DOM автоматически.
});
render();
