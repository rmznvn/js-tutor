const products = [
  { id: 1, title: "UI Kit", category: "design", free: true },
  { id: 2, title: "Иконки", category: "design", free: false },
  { id: 3, title: "React-шаблон", category: "code", free: true },
];

function filterProducts(items, filters) {
  // Пустая категория разрешает любую; включённый флажок требует free === true.
  // Оба ограничения должны выполняться одновременно.
  return items.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.onlyFree || item.free)
  );
}

// Храним выбранные значения, а список и чипы каждый раз вычисляем.
let filters = { category: "", onlyFree: false };
const category = document.getElementById("category");
const onlyFree = document.getElementById("free");
const chips = document.getElementById("chips");
const list = document.getElementById("products");
const count = document.getElementById("count");

function render() {
  // Обратная синхронизация нужна после удаления чипа, не только после ввода.
  category.value = filters.category;
  onlyFree.checked = filters.onlyFree;
  chips.replaceChildren();
  const active = [];
  if (filters.category) active.push({ key: "category", text: filters.category === "design" ? "Дизайн" : "Код" });
  if (filters.onlyFree) active.push({ key: "onlyFree", text: "Бесплатные" });
  active.forEach((chip) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Убрать фильтр: " + chip.text;
    button.addEventListener("click", () => {
      // Сбрасываем одно поле; spread сохраняет остальные ограничения.
      filters = { ...filters, [chip.key]: chip.key === "category" ? "" : false };
      render();
      // Удалённая кнопка больше не может держать фокус: возвращаем его к полю.
      (chip.key === "category" ? category : onlyFree).focus();
    });
    chips.append(button);
  });
  const visible = filterProducts(products, filters);
  count.textContent = visible.length ? "Найдено: " + visible.length : "Ничего не найдено";
  list.replaceChildren();
  visible.forEach((item) => {
    const li = document.createElement("li");li.textContent = item.title;list.append(li);
  });
}
category.addEventListener("change", () => { filters = { ...filters, category: category.value };render(); });
onlyFree.addEventListener("change", () => { filters = { ...filters, onlyFree: onlyFree.checked };render(); });
render();
