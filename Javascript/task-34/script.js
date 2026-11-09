const products = [
  { id: 1, title: "Бесплатный шаблон", price: 0 },
  { id: 2, title: "Набор иконок", price: 500 },
  { id: 3, title: "UI Kit", price: 1500 },
  { id: 4, title: "Шаблон сайта", price: 3000 },
];

function filterByPrice(items, minInput, maxInput) {
  // Строки приходят из полей. Пустота означает отсутствие границы.
  // Проверяем её ДО Number, потому что Number("") равно 0.
  const minText = minInput.trim();
  const maxText = maxInput.trim();
  const min = minText === "" ? null : Number(minText);
  const max = maxText === "" ? null : Number(maxText);

  // Number.isFinite отвергает NaN и Infinity.
  // Допустимая граница — конечное неотрицательное число, включая 0.
  const invalidMin = min !== null && (!Number.isFinite(min) || min < 0);
  const invalidMax = max !== null && (!Number.isFinite(max) || max < 0);
  if (invalidMin || invalidMax) {
    return { items: [], error: "Введите неотрицательные конечные числа." };
  }

  if (min !== null && max !== null && min > max) {
    return { items: [], error: "Минимум не должен превышать максимум." };
  }

  return {
    // Обе границы включены. null отключает только свою проверку.
    // filter создаёт новый массив, сами товары не изменяет.
    items: items.filter((item) =>
      (min === null || item.price >= min) &&
      (max === null || item.price <= max)
    ),
    error: "",
  };
}

// Без границ возвращаются все товары.
console.log(filterByPrice(products, "", " "));
// Максимум 0 — реальное ограничение: только бесплатный товар.
console.log(filterByPrice(products, "", "0"));
// Включены обе границы: ID 2 и 3.
console.log(filterByPrice(products, " 500 ", "1500"));
// Ошибочный диапазон отличается от корректной пустой выдачи.
console.log(filterByPrice(products, "1500", "500"));
console.log(filterByPrice(products, "abc", ""));
console.log(filterByPrice(products, "600", "700"));
