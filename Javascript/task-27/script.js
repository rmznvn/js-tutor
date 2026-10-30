// Чистая функция общая для двух подходов:
// принимает строки и возвращает сообщение либо пустую строку.
function validateAddress(method, address) {
  // Адрес нужен только курьеру. Пробелы не считаются адресом.
  if (method === "courier" && address.trim().length < 5) {
    return "Введите адрес: минимум 5 символов без пробелов по краям.";
  }
  return "";
}

let method = "pickup";
let address = ""; // Черновик сохраняется при переключении способа.
let submitted = false; // Показывать ли проверку текущей попытки.

const form = document.getElementById("order-form");
const methodSelect = document.getElementById("method");
const addressField = document.getElementById("address-field");
const addressInput = document.getElementById("address");
const error = document.getElementById("address-error");
const result = document.getElementById("result");

function render() {
  const isCourier = method === "courier";
  // Проверка зависит и от способа, и от адреса.
  const message = submitted ? validateAddress(method, address) : "";

  addressField.hidden = !isCourier;
  addressInput.disabled = !isCourier;
  error.textContent = message;
  addressInput.setAttribute("aria-invalid", String(Boolean(message)));
}

methodSelect.addEventListener("change", (event) => {
  method = event.target.value;
  // Старое подтверждение уже не относится к изменённому заказу.
  submitted = false;
  result.textContent = "";
  render();
});

addressInput.addEventListener("input", (event) => {
  address = event.target.value;
  result.textContent = "";
  // После первой попытки ошибка обновляется по мере исправления.
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Не перезагружаем учебную страницу.
  submitted = true;
  const message = validateAddress(method, address);
  render();
  if (message) {
    result.textContent = "";
    addressInput.focus(); // Помогаем перейти к полю с ошибкой.
    return;
  }

  // При самовывозе старый адрес НЕ попадает в итоговый объект.
  const payload = method === "courier"
    ? { method, address: address.trim() }
    : { method };

  // Это локальная проверка, а не отправка на сервер.
  result.textContent = "Проверено локально: " + JSON.stringify(payload);
});

render();
