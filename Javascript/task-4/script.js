const articles = [
  { id: 1, title: "BIM-модели" },
  { id: 2, title: "Общие данные" },
  { id: 3, title: "Планирование" },
  { id: 4, title: "Проверка документов" },
  { id: 5, title: "AI в строительстве" },
];

function paginate(items, page, pageSize) {
  // Предусловия: page целый, pageSize — положительный целый.
  // Округляем вверх: неполная последняя страница тоже считается.
  const totalPages = Math.ceil(items.length / pageSize);
  // У пустого массива нет страниц; currentPage по условию равен 1.
  if (totalPages === 0) {
    return { items: [], currentPage: 1, totalPages: 0 };
  }
  // Ограничиваем номер сверху последней страницей и снизу единицей.
  const currentPage = Math.max(1, Math.min(page, totalPages));
  // Страницы начинаются с 1, индексы массива — с 0.
  const startIndex = (currentPage - 1) * pageSize;
  // Конечный индекс slice не включается; исходный массив сохраняется.
  const pageItems = items.slice(startIndex, startIndex + pageSize);
  return { items: pageItems, currentPage, totalPages };
}

// Альтернатива: filter получает индекс вторым аргументом.
// Выбираем элементы в том же полуоткрытом диапазоне [start, end).
function paginateWithFilter(items, page, pageSize) {
  const totalPages = Math.ceil(items.length / pageSize);
  if (totalPages === 0) return { items: [], currentPage: 1, totalPages: 0 };
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.filter((item, index) => index >= start && index < start + pageSize),
    currentPage,
    totalPages,
  };
}
console.log("Страница 2:", paginate(articles, 2, 2));
console.log("Страница 99:", paginate(articles, 99, 2));
console.log("Страница 0:", paginate(articles, 0, 2));
console.log("Пустой массив:", paginate([], 1, 2));
