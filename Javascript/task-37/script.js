let shipping = "Москва, Лесная 1";
let billingDraft = "Казань, Мира 2";
let sameAddress = false;

const shippingInput = document.getElementById("shipping");
const billingInput = document.getElementById("billing");
const sameCheckbox = document.getElementById("same");
const hint = document.getElementById("billing-hint");
const summary = document.getElementById("summary");

function render() {
  // Рабочий адрес вычисляем, а независимый черновик не перезаписываем.
  const effectiveBilling = sameAddress ? shipping : billingDraft;
  shippingInput.value = shipping;
  sameCheckbox.checked = sameAddress;
  billingInput.value = effectiveBilling;
  billingInput.disabled = sameAddress;

  hint.textContent = sameAddress
    ? "Используется адрес доставки. Снимите отметку для отдельного адреса."
    : "Можно указать отдельный адрес оплаты.";
  summary.textContent =
    "Доставка: " + shipping + ". Оплата: " + effectiveBilling;
}

shippingInput.addEventListener("input", (event) => {
  shipping = event.target.value;
  // При включённой связи новый адрес оплаты получится в render.
  render();
});

billingInput.addEventListener("input", (event) => {
  billingDraft = event.target.value;
  render();
});

sameCheckbox.addEventListener("change", (event) => {
  // Переключаем правило выбора адреса, не копируем строки.
  sameAddress = event.target.checked;
  render();
});
render();
