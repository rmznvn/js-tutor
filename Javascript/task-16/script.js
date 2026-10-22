const PAGE_SIZE = 3;
const articlePages = [
  [{id:1,title:"Оптимизация изображений"},{id:2,title:"Основы React state"},{id:3,title:"Фильтрация CMS-карточек"}],
  [{id:4,title:"Работа с localStorage"},{id:5,title:"Доступные модальные окна"},{id:6,title:"Сортировка данных"}],
  [{id:7,title:"Асинхронный JavaScript"},{id:8,title:"Проверка форм"}],
];
let secondPageShouldFail = true;
function requestArticles(pageNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pageNumber === 2 && secondPageShouldFail) {
        secondPageShouldFail = false;
        reject(new Error("Учебная ошибка второй страницы."));
        return; // После reject не продолжаем обработку.
      }
      resolve(articlePages[pageNumber - 1] ?? []);
    }, 1000);
  });
}
let loadedArticles = [];
let currentPage = 0;
let isLoading = false;
let hasMore = true;
let loadError = "";
const list = document.getElementById("list");
const button = document.getElementById("load");
const errorElement = document.getElementById("error");
const statusElement = document.getElementById("status");
function render() {
  list.replaceChildren();
  loadedArticles.forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article.title;
    list.append(item);
  });
  errorElement.textContent = loadError;
  statusElement.textContent = isLoading ? "Загружаем статьи…" : "Загружено: " + loadedArticles.length;
  button.disabled = isLoading;
  button.hidden = !hasMore;
  button.textContent = isLoading ? "Загрузка…" : loadError ? "Повторить" :
    currentPage === 0 ? "Загрузить статьи" : "Загрузить ещё";
}
async function loadNextPage() {
  if (isLoading || !hasMore) return; // Защита также внутри логики.
  isLoading = true;
  loadError = "";
  render();
  const requestedPage = currentPage + 1;
  try {
    const newArticles = await requestArticles(requestedPage);
    loadedArticles = [...loadedArticles, ...newArticles];
    currentPage = requestedPage; // Только успешный ответ продвигает страницу.
    // В этом API неполная порция означает конец.
    hasMore = newArticles.length === PAGE_SIZE;
  } catch (error) {
    console.error(error);
    loadError = "Загрузка не удалась. Попробуйте ещё раз.";
  } finally {
    isLoading = false; // Обязательно и при успехе, и при исключении.
    render();
  }
}
button.addEventListener("click", loadNextPage);
render();
