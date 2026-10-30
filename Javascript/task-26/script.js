const articles = [
  { id: "a", title: "Основы CMS", category: "webflow" },
  { id: "b", title: "Состояние", category: "react" },
  { id: "c", title: "Коллекции", category: "webflow" },
  { id: "d", title: "Динамические страницы", category: "webflow" },
];

// Контракт: уникальные строковые ID; массив уже расположен
// в нужном редактору порядке. Функция ничего не сортирует.
function getArticleNeighbors(items, currentId) {
  const current = items.find((item) => item.id === currentId);

  // Если текущей статьи нет, определять её категорию невозможно.
  if (!current) return { previous: null, next: null };

  // filter сохраняет относительный порядок и не меняет items.
  const related = items.filter(
    (item) => item.category === current.category
  );
  const index = related.findIndex((item) => item.id === currentId);

  return {
    // За границами массива получается undefined.
    // Возвращаем согласованный контракт: статья либо null.
    previous: related[index - 1] ?? null,
    next: related[index + 1] ?? null,
  };
}

// Для c соседи a и d: статья b относится к другой категории.
console.log(getArticleNeighbors(articles, "c"));
// У первой статьи нет предыдущей; у единственной b нет обоих соседей.
console.log(getArticleNeighbors(articles, "a"));
console.log(getArticleNeighbors(articles, "b"));
// Неизвестный ID и пустой массив дают два null без ошибки.
console.log(getArticleNeighbors(articles, "missing"));
console.log(getArticleNeighbors([], "a"));
