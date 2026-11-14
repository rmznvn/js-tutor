const articles = [
  { id: 1, title: "Формы и состояние React" },
  { id: 2, title: "События JavaScript" },
  { id: 3, title: "Webflow CMS" },
  { id: 4, title: "React: компоненты" },
];

function searchArticles(items, query) {
  // \\s+ означает один или несколько пробельных символов.
  // filter убирает пустой фрагмент, возникающий при пустом запросе.
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((article) => {
    const title = article.title.toLowerCase();
    // every требует совпадения КАЖДОГО фрагмента.
    // Для пустого words возвращается true: показываем все статьи.
    return words.every((word) => title.includes(word));
  });
}

const queryInput = document.getElementById("query");
const list = document.getElementById("articles");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

function render() {
  const visible = searchArticles(articles, queryInput.value);
  count.textContent = "Найдено: " + visible.length;
  empty.hidden = visible.length !== 0;
  // Поле поиска вне списка: оно не пересоздаётся при вводе.
  list.replaceChildren();

  visible.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
}

queryInput.addEventListener("input", render);
render();
