const rawCards = [
  { id: 1, title: " React ", pricing: { amount: 0 }, author: { name: "Анна" } },
  { id: 2, title: "", pricing: { amount: 1500 }, author: null },
  { id: 3, pricing: null },
  { id: 4, title: "DOM", pricing: { amount: 2500 }, author: { name: " " } },
];

function prepareCards(items) {
  return items.map((item) => {
    // Контракт: title/name — строка или отсутствует; amount — число >= 0 или null.
    // ?. допускает отсутствие промежуточных объектов.
    // ?? сохраняет допустимый 0, подставляя null только для null/undefined.
    const price = item.pricing?.amount ?? null;

    return {
      id: item.id,
      // После trim пустая строка тоже требует подстановки, поэтому используем ||.
      title: item.title?.trim() || "Без названия",
      authorName: item.author?.name?.trim() || "Автор не указан",
      price,
      // null означает неизвестную цену, 0 — бесплатный материал.
      priceLabel: price === null ? "Цена не указана" :
        price === 0 ? "Бесплатно" : price + " ₽",
    };
  });
}

// Новые объекты готовы для карточек; rawCards и вложенные объекты не меняются.
console.log(prepareCards(rawCards));
console.log(prepareCards([])); // Пустой вход даёт пустой результат.
