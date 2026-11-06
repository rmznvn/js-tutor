const products = [
  { id: 1, title: "Блокнот", inStock: false, price: 200 },
  { id: 2, title: "Папка", inStock: true, price: 500 },
  { id: 3, title: "Альбом", inStock: true, price: 200 },
  { id: 4, title: "Карандаш", inStock: true, price: 200 },
  { id: 5, title: "Ластик", inStock: false, price: 100 },
  { id: 6, title: "Альбом", inStock: true, price: 200 },
];

function sortProducts(items) {
  // sort изменяет массив: сортируем поверхностную копию.
  // Объекты только читаем, поэтому копировать их не требуется.
  return [...items].sort((a, b) => {
    // Правило 1: товары в наличии идут первыми.
    // true превращается в 1: b - a даёт приоритет a.inStock=true.
    const stockDifference = Number(b.inStock) - Number(a.inStock);
    if (stockDifference !== 0) return stockDifference;

    // Правило 2 действует только при одинаковом наличии.
    const priceDifference = a.price - b.price;
    if (priceDifference !== 0) return priceDifference;

    // Правило 3: алфавитный порядок русских названий.
    // Важен знак результата localeCompare, а не точное -1 или 1.
    return a.title.localeCompare(b.title, "ru");
  });
}

// Порядок ID: 3, 6, 4, 2, 5, 1.
// 3 и 6 равны по всем критериям: стабильная сортировка сохраняет их порядок.
console.log(sortProducts(products));
// Исходный порядок не меняется.
console.log(products);
console.log(sortProducts([])); // Пустой набор остаётся пустым.
