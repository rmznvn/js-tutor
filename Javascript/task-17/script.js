const ARTICLES_PER_PAGE = 3;
const articles = [
  {id:1,title:"Основы Webflow CMS"},{id:2,title:"Методы массивов"},
  {id:3,title:"Состояние в React"},{id:4,title:"Доступность форм"},
  {id:5,title:"Работа с localStorage"},{id:6,title:"Асинхронный JavaScript"},
  {id:7,title:"Оптимизация изображений"},{id:8,title:"Фильтрация карточек"},
];
let visibleCount = Math.min(ARTICLES_PER_PAGE, articles.length);
const list = document.getElementById("list");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const more = document.getElementById("more");
const collapse = document.getElementById("collapse");
function render() {
  const visible = articles.slice(0, visibleCount); // Новый массив без удаления данных.
  list.replaceChildren();
  visible.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
  count.textContent = "Показано " + visible.length + " из " + articles.length;
  empty.hidden = articles.length !== 0;
  more.hidden = visibleCount >= articles.length;
  collapse.hidden = visibleCount <= ARTICLES_PER_PAGE;
}
more.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + ARTICLES_PER_PAGE, articles.length);
  render();
});
collapse.addEventListener("click", () => {
  visibleCount = Math.min(ARTICLES_PER_PAGE, articles.length);
  render();
});
render();
