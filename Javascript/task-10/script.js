// Контракт: количество из поля — строка, delivery — известный код, promo — строка.
function calculateOrder(quantityValue, delivery, promoValue) {
  const quantity = Number(quantityValue);
  const promo = promoValue.trim().toUpperCase();
  // Единый формат ошибки упрощает отображение.
  const invalid = (error) => ({
    isValid: false, error, subtotal: 0, discount: 0, deliveryPrice: 0, total: 0,
  });
  // Number("") равен 0: границы также исключают пустой ввод.
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return invalid("Введите целое количество от 1 до 10.");
  }
  if (promo !== "" && promo !== "START10") return invalid("Промокод не найден.");
  // Неизвестный способ не должен незаметно превращаться в бесплатную доставку.
  if (delivery !== "electronic" && delivery !== "courier") {
    return invalid("Выберите способ доставки.");
  }
  const subtotal = quantity * 2500;
  const discount = promo === "START10" ? subtotal * 0.1 : 0;
  const deliveryPrice = delivery === "courier" ? 500 : 0;
  // Доставка добавляется ПОСЛЕ скидки, поэтому не дисконтируется.
  return { isValid: true, error: "", subtotal, discount, deliveryPrice,
    total: subtotal - discount + deliveryPrice };
}
const form = document.getElementById("order-form");
const quantity = document.getElementById("quantity");
const delivery = document.getElementById("delivery");
const promo = document.getElementById("promo");
const errorElement = document.getElementById("order-error");
const summary = document.getElementById("order-summary");
const statusElement = document.getElementById("order-status");
const submit = document.getElementById("submit-button");
function getCurrentOrder() {
  return calculateOrder(quantity.value, delivery.value, promo.value);
}
function render() {
  const result = getCurrentOrder();
  // Редактирование отменяет подтверждение предыдущего заказа.
  statusElement.textContent = "";
  errorElement.textContent = result.error;
  summary.hidden = !result.isValid;
  submit.disabled = !result.isValid;
  if (!result.isValid) return;
  summary.textContent = "Лицензии: " + result.subtotal + " ₽; скидка: " +
    result.discount + " ₽; доставка: " + result.deliveryPrice +
    " ₽; итого: " + result.total + " ₽.";
}
form.addEventListener("input", render);
delivery.addEventListener("change", render);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = getCurrentOrder(); // Повторно проверяем актуальные поля.
  render();
  if (!result.isValid) return;
  // Здесь нет сервера: это только демонстрация обработки корректной формы.
  statusElement.textContent = "Учебный заказ оформлен. Сумма: " + result.total + " ₽.";
});
render();
