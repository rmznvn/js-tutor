const PAGE_SIZE = 2;
const articles = [
  { id: 1, title: "Методы массивов", category: "js" },
  { id: 2, title: "Состояние React", category: "react" },
  { id: 3, title: "События DOM", category: "js" },
  { id: 4, title: "React-формы", category: "react" },
  { id: 5, title: "Webflow CMS", category: "webflow" },
  { id: 6, title: "Асинхронный JS", category: "js" },
];

function getPageData(items, category, page) {
  // Сначала фильтруем весь набор; лишь затем выбираем страницу.
  const filtered = category === "all" ? items :
    items.filter((article) => article.category === category);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  // Внутренний номер остаётся >= 1 даже при пустом наборе.
  const currentPage = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
  const start = (currentPage - 1) * PAGE_SIZE;
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    pageCount,
    currentPage,
  };
}

let state = { category: "all", page: 1 };
const categorySelect = document.getElementById("category");
const list = document.getElementById("list");
const total = document.getElementById("total");
const pageInfo = document.getElementById("page-info");
const empty = document.getElementById("empty");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

function render() {
  const data = getPageData(articles, state.category, state.page);
  categorySelect.value = state.category;
  total.textContent = "Найдено: " + data.total;
  // Для пустого набора честно отображаем 0 из 0.
  pageInfo.textContent = "Страница " + (data.pageCount === 0 ? 0 : data.currentPage) +
    " из " + data.pageCount;
  empty.hidden = data.total !== 0;
  previous.disabled = data.currentPage <= 1;
  next.disabled = data.currentPage >= data.pageCount;
  list.replaceChildren();
  data.items.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
}

categorySelect.addEventListener("change", (event) => {
  // Новый фильтр может сократить число страниц: начинаем с первой.
  state = { category: event.target.value, page: 1 };
  render();
});

function changePage(delta) {
  const data = getPageData(articles, state.category, state.page);
  const page = Math.min(Math.max(data.currentPage + delta, 1), Math.max(data.pageCount, 1));
  state = { ...state, page };
  render();
}
previous.addEventListener("click", () => changePage(-1));
next.addEventListener("click", () => changePage(1));
render();
