const articles = [
  { id: 0, title: "Основы CMS" },
  { id: 1, title: "Формы React" },
  { id: 2, title: "События DOM" },
];

let pinnedId = null; // null — отсутствие выбора; 0 — допустимый ID.
const list = document.getElementById("articles");
const status = document.getElementById("pinned");

// Создаём кнопки один раз; при переключении они сохраняют фокус.
const controls = articles.map((article) => {
  const item = document.createElement("li");
  const title = document.createElement("span");
  title.textContent = article.title + " ";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Закрепить";
  // Постоянное имя toggle-кнопки содержит название конкретной статьи.
  button.setAttribute("aria-label", "Закрепить: " + article.title);
  button.addEventListener("click", () => {
    // Повторный клик снимает выбор; другой ID заменяет прежний.
    pinnedId = pinnedId === article.id ? null : article.id;
    render();
  });

  item.append(title, button);
  list.append(item);
  return { id: article.id, button };
});

function render() {
  // Название вычисляем из ID: отдельный объект выбранной статьи не храним.
  const pinnedArticle = articles.find((article) => article.id === pinnedId);
  status.textContent = pinnedArticle
    ? "Закреплено: " + pinnedArticle.title
    : "Ничего не закреплено";

  controls.forEach(({ id, button }) => {
    // Сравнение работает и для ID 0. Порядок карточек не меняем.
    button.setAttribute("aria-pressed", String(id === pinnedId));
  });
}
render();
