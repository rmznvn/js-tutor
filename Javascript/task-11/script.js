function addSearchQuery(history, query) {
  const prepared = query.trim();
  if (prepared === "") return history; // Пустой запрос не меняет историю.
  const normalized = prepared.toLowerCase();
  // Сравнение без регистра, отображение — с последним введённым регистром.
  const withoutDuplicate = history.filter((item) => item.toLowerCase() !== normalized);
  // Новая версия первая; slice возвращает максимум пять без мутации.
  return [prepared, ...withoutDuplicate].slice(0, 5);
}
function removeSearchQuery(history, query) {
  return history.filter((item) => item !== query);
}
const form = document.getElementById("search-form");
const input = document.getElementById("query");
const list = document.getElementById("history");
const empty = document.getElementById("empty");
const clear = document.getElementById("clear");
let searchHistory = [];
function render() {
  list.replaceChildren(); // Старый список не должен дублироваться.
  empty.hidden = searchHistory.length !== 0;
  clear.disabled = searchHistory.length === 0;
  searchHistory.forEach((query) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const remove = document.createElement("button");
    text.textContent = query; // Строку не интерпретируем как HTML.
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.setAttribute("aria-label", "Удалить запрос " + query);
    remove.addEventListener("click", () => {
      searchHistory = removeSearchQuery(searchHistory, query);
      render();
    });
    item.append(text, " ", remove);
    list.append(item);
  });
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchHistory = addSearchQuery(searchHistory, input.value);
  input.value = "";
  input.focus();
  render();
});
clear.addEventListener("click", () => { searchHistory = []; render(); });
render();
