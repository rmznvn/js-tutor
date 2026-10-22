# Калькулятор стоимости заказа — JavaScript

Выпуск **2026-10-12**. Время: **30–40 минут**.

## Условие

Пользователь выбирает лицензии, доставку документов и промокод; итог пересчитывается без перезагрузки.

### Входные данные и критерии готовности

- Лицензия 2500 ₽; целое количество от 1 до 10.
- electronic — 0 ₽, courier — 500 ₽.
- START10 даёт 10% только на лицензии; trim и toUpperCase для промокода.
- Пустой промокод допустим, неизвестный — ошибка; некорректное количество блокирует расчёт.
- Чистая calculateOrder возвращает объект проверки и сумм.
- Submit показывает учебное подтверждение без реальной отправки.

### Крайние случаи

- Пустое количество.
- 0, 11 или дробное количество.
- " start10 " принимается.

## Как рассуждать

1. **Интервьюер:** «Что возвращать при ошибке?»
2. **Интервьюер:** «Почему Number и Number.isInteger?»
3. **Интервьюер:** «В каком порядке считать?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Верну объект с isValid, error и суммами: интерфейс получит единый контракт.»

> «value — строка. Number преобразует её, а Number.isInteger и границы исключат NaN, дробь и ноль.»

> «Сначала стоимость лицензий, затем скидка, затем доставка. Проверю: 2 лицензии + courier + START10 = 5000 ₽.»

## Пошаговый разбор

1. Прочитать поля отдельно от расчёта.
2. Преобразовать количество и проверить границы.
3. Нормализовать промокод.
4. Проверить способ доставки.
5. Вычислить subtotal, discount, deliveryPrice, total.
6. Перерисовать по input/change; повторно проверить submit.

## Типичные ошибки

- Скидка на доставку.
- Number('') даёт 0, поэтому нужны границы.
- Submit по устаревшему итогу.

## Альтернативный способ

Объекты тарифов и скидок упрощают расширение на множество вариантов, но для двух способов доставки прямые проверки проще.

## Ручная проверка

2/electronic/пустой → 5000; 2/courier/пустой → 5500; 2/courier/START10 → 5000; 1/electronic/start10 → 2250; 0 → ошибка.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
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

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Заказ лицензий</h1><form id="order-form" novalidate><label>Количество <input id="quantity" type="number" min="1" max="10" step="1" value="1"></label><label>Доставка <select id="delivery"><option value="electronic">Электронная — бесплатно</option><option value="courier">Курьерская — 500 ₽</option></select></label><label>Промокод <input id="promo" type="text"></label><p id="order-error" role="alert"></p><p id="order-summary"></p><button id="submit-button" type="submit">Оформить заказ</button><p id="order-status" role="status"></p></form></main><script src="./script.js"></script></body>
</html>

```

</details>
