# JavaScript → React: условная проверка доставки
Выпуск: 30 октября 2026.

## Условие
Форма оформления заказа предлагает самовывоз (pickup) и курьера (courier).
Входные данные: способ по умолчанию pickup, адрес — пустая строка.
Для курьера покажи адрес: минимум 5 символов после trim. Это учебное правило длины, не проверка реальности адреса.
Для самовывоза адрес не нужен и не должен попадать в итоговый объект.
При переключении сохрани адрес как черновик. При возврате к курьеру он снова виден.
Ошибка появляется после попытки отправки; после неё обновляется при вводе. Смена способа сбрасывает попытку и результат. Любое изменение очищает старое подтверждение.
Готово, если обе версии используют одинаковое правило проверки и выводят локальный результат: { method } либо { method, address }. Сервера нет.
Крайние случаи: пробельный адрес; 4/5 символов после trim; курьер → самовывоз → курьер.
Время: 35–45 минут на обе версии.

## Как рассуждать
1. Скрытое поле автоматически перестаёт участвовать в нашей проверке?
2. Какие данные хранить, а какие вычислять?
3. Можно ли после setSubmitted(true) сразу проверять error?

Раздели черновик, проверку и подготовку результата. Определи, когда сообщение должно стать видимым.

## Примеры ответов вслух
«Скрытие поля меняет интерфейс, но не правило моей JS-функции. Валидатор должен сначала проверить способ доставки. При самовывозе возвращу пустую строку ошибки независимо от старого адреса».
«Храню способ, адрес, флаг попытки и последний результат. Текущую ошибку вычисляю. Результат — снимок успешной локальной проверки, поэтому при изменениях очищаю его».
«setSubmitted запрашивает новый рендер, но не меняет error текущего вызова. В обработчике вызову validateAddress напрямую. В JS после событий вызываю render; в React обновляю state, JSX описывает видимость».
«Черновик адреса сохраняю для удобства пользователя, но payload собираю отдельно: для pickup включаю только method. Проверю пробелы, границу 5 и отсутствие адреса в результате самовывоза».

## Пошаговый разбор
1. Напиши чистую validateAddress(method, address), возвращающую сообщение либо пустую строку.
2. Подготовь состояния способа, адреса и попытки; результат хранит последнее подтверждение.
3. Показывай поле только для курьера. В DOM дополнительно отключи скрытый input.
4. В submit отмени перезагрузку, отметь попытку и проверь валидатор.
5. При ошибке остановись; при успехе собери объект по способу получения.
6. Смена способа очищает попытку и результат, но не адрес.
7. При вводе очищай результат и пересчитывай видимую ошибку.

Различия: DOM-версия сохраняет input и переключает hidden/disabled. React-версия удаляет input условным JSX, но address находится выше в состоянии компонента и переживает скрытие.
Ошибки: всегда проверять адрес; считать скрытие очисткой данных; отправлять весь черновик при самовывозе; читать старую error сразу после setter.
Проверки: стартовый pickup → {method:"pickup"}; courier с пробелами → ошибка; "1234" → ошибка; " 12345 " → адрес "12345"; pickup после курьера → без address; возврат к courier → прежний ввод; редактирование после успеха убирает подтверждение.
Альтернатива: нативные required/minLength и встроенная проверка формы. Короче и использует браузерные сообщения, но minLength считает строку без trim; отключать проверку скрытого поля тоже придётся. Здесь нужен единый валидатор для обеих реализаций.

## Запуск
JavaScript: открой index.html. React: npm ci, npm run dev; Codespaces: npm run dev -- --host 0.0.0.0.
В JavaScript при ошибке явно фокусируем input. В React автоматический фокус не добавляем: useRef пока не требуется; ошибка связана с полем через aria-describedby.

Сравни с [другой реализацией](../../react/task-28/).

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### index.html

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Способ получения</title>
</head>
<body>
  <h1>Получение заказа</h1>
  <!-- noValidate отключает встроенную проверку:
       учебное правило и сообщение об ошибке реализованы в JS. -->
  <form id="order-form" novalidate>
    <label for="method">Способ получения</label>
    <select id="method">
      <option value="pickup">Самовывоз</option>
      <option value="courier">Курьер</option>
    </select>

    <!-- При самовывозе поле недоступно и скрыто. -->
    <div id="address-field" hidden>
      <label for="address">Адрес доставки</label>
      <input id="address" disabled aria-describedby="address-error">
    </div>
    <p id="address-error" role="alert"></p>

    <button type="submit">Проверить заказ</button>
    <p id="result" role="status"></p>
  </form>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
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
```

</details>
