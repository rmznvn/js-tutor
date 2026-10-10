// Тарифы сортируем по цене, при равенстве — по названию.
const plans = [
  { id: 1, title: "Команда", price: 3000 },
  { id: 2, title: "Базовый", price: 1000 },
  { id: 3, title: "Бизнес", price: 3000 },
  { id: 4, title: "Демо", price: 0 },
];

function sortPlans(plans, direction) {
  // sort меняет массив, поэтому сначала создаём поверхностную копию.
  // Объекты не копируем: меняется только порядок, а не их поля.
  return [...plans].sort((a, b) => {
    const priceDifference = a.price - b.price;
    // Отрицательное число ставит a раньше b; положительное — позже.
    if (priceDifference !== 0) {
      return direction === "asc" ? priceDifference : -priceDifference;
    }
    // При равных ценах алфавитный порядок сохраняется в обоих режимах.
    return a.title.localeCompare(b.title, "ru");
  });
}

// Альтернатива: сначала группируем тарифы по цене.
// Полезна, когда интерфейс тоже показывает отдельные ценовые группы.
function sortPlansByGroups(plans, direction) {
  const groups = plans.reduce((result, plan) => {
    // Ключ — цена, значение — новый локальный массив группы.
    if (!result[plan.price]) result[plan.price] = [];
    result[plan.price].push(plan);
    return result;
  }, {});
  const prices = Object.keys(groups).map(Number).sort(
    (a, b) => direction === "asc" ? a - b : b - a
  );
  // Группы локальные: их сортировка не меняет входной массив.
  return prices.reduce((result, price) => {
    const group = groups[price].sort(
      (a, b) => a.title.localeCompare(b.title, "ru")
    );
    return [...result, ...group];
  }, []);
}

console.log("asc:", sortPlans(plans, "asc").map((plan) => plan.id));
console.log("desc:", sortPlans(plans, "desc").map((plan) => plan.id));
console.log("Исходный порядок:", plans.map((plan) => plan.id));
