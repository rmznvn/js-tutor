const currentArticles = [
  { id: 1, title: "Основы CMS", published: false },
  { id: 2, title: "React: черновик", published: false },
];
const incomingArticles = [
  { id: 2, title: "React: состояние", published: true },
  { id: 3, title: "События DOM", published: false },
  { id: 2, title: "React: обновлённая статья", published: false },
];

function mergeArticles(current, incoming) {
  // Копируем массив и каждый плоский объект.
  // Последующие изменения результата не затронут входные объекты.
  const result = current.map((article) => ({ ...article }));

  incoming.forEach((article) => {
    const index = result.findIndex((item) => item.id === article.id);
    // Создаём копию и для входящих записей.
    const copy = { ...article };

    // Нельзя проверять if(index): 0 — найденный индекс, -1 — отсутствие.
    if (index === -1) {
      result.push(copy); // Новый ID добавляется в конец.
    } else {
      // Последняя входящая версия побеждает целиком.
      // Замена на прежней позиции сохраняет порядок.
      result[index] = copy;
    }
  });

  // Мутировался только созданный внутри функции result.
  return result;
}

// Порядок: 1, 2, 3; для ID 2 берётся последняя версия.
console.log(mergeArticles(currentArticles, incomingArticles));
// При пустом обновлении возвращаются копии исходных записей.
console.log(mergeArticles(currentArticles, []));
// Исходные массивы и объекты не изменены.
console.log(currentArticles, incomingArticles);
