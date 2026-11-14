const products = [
  { id: "p-101", name: "Настольная лампа", price: 4200 },
  { id: "p-102", name: "Кресло", price: 18900 },
  { id: "p-103", name: "Настенный светильник", price: 6500 },
  { id: "p-104", name: "Стол", price: 24500 },
  { id: "p-105", name: "Книжная полка", price: 11200 },
];

const STORAGE_KEY = "js-tutor:recent-products";
const MAX_RECENT = 4;

const productGrid = document.querySelector("#product-grid");
const recentList = document.querySelector("#recent-list");
const emptyState = document.querySelector("#recent-empty");

// Восстанавливаем ID, но не доверяем содержимому localStorage.
function readRecentIds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    // Даже корректный JSON может содержать не массив.
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((id, index) => {
        // Оставляем только ID, которые есть в текущем каталоге.
        const existsInCatalog = products.some((product) => product.id === id);

        // Если ID повторяется, сохраняем только первое вхождение.
        const isFirstOccurrence = parsed.indexOf(id) === index;

        return existsInCatalog && isFirstOccurrence;
      })
      .slice(0, MAX_RECENT);
  } catch (error) {
    // Например, JSON.parse выбросил SyntaxError или storage недоступен.
    return [];
  }
}

// Сохраняем только массив ID. Ошибка storage не должна ломать каталог.
function saveRecentIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    // История останется доступной в памяти до перезагрузки страницы.
  }
}

// Создаём карточки из данных каталога.
function renderProducts() {
  productGrid.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const button = document.createElement("button");

    title.textContent = product.name;
    price.textContent = product.price.toLocaleString("ru-RU") + " ₽";

    button.type = "button";
    button.textContent = "Открыть карточку";
    // data-атрибут связывает кнопку с конкретным товаром.
    button.dataset.productId = product.id;

    card.append(title, price, button);
    productGrid.append(card);
  });
}

// Рисуем историю по ID, используя актуальные объекты из каталога.
function renderRecent() {
  recentList.replaceChildren();

  const recentProducts = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  emptyState.hidden = recentProducts.length > 0;

  recentProducts.forEach((product) => {
    const item = document.createElement("li");

    // textContent вставляет название как обычный текст.
    item.textContent =
      product.name + " — " + product.price.toLocaleString("ru-RU") + " ₽";

    recentList.append(item);
  });
}

// Текущее состояние истории хранится в памяти и синхронизируется с storage.
let recentIds = readRecentIds();

// Один обработчик обслуживает все кнопки внутри каталога.
productGrid.addEventListener("click", (event) => {
  // closest позволяет нажать не только на текст кнопки, но и на её вложенный элемент.
  const button = event.target.closest("button[data-product-id]");

  // Игнорируем клики по карточке вне кнопки.
  if (!button || !productGrid.contains(button)) return;

  const productId = button.dataset.productId;

  // Защищаемся от неизвестного ID, даже если DOM был изменён вручную.
  const existsInCatalog = products.some((product) => product.id === productId);
  if (!existsInCatalog) return;

  // Удаляем старое вхождение ID, добавляем его в начало и ограничиваем длину.
  recentIds = [
    productId,
    ...recentIds.filter((id) => id !== productId),
  ].slice(0, MAX_RECENT);

  saveRecentIds(recentIds);
  renderRecent();
});

// Сначала создаём каталог, затем восстанавливаемую историю.
renderProducts();
renderRecent();
