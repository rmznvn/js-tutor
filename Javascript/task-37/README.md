# JavaScript → React: адрес оплаты совпадает с доставкой
Выпуск: 11 ноября 2026.

## Условие
Есть адрес доставки «Москва, Лесная 1», независимый адрес оплаты «Казань, Мира 2» и выключенный checkbox «Адрес оплаты совпадает с доставкой».
В независимом режиме редактируются оба поля. При включении checkbox поле оплаты показывает адрес доставки и становится disabled. Изменение доставки сразу отражается в оплате.
Снятие checkbox восстанавливает последний независимый адрес оплаты, а не копию доставки. Сводка всегда использует текущий рабочий адрес.
Готово: JS- и React-версии, хранить shipping/billingDraft/sameAddress, effectiveBilling вычислять; не копировать shipping в billingDraft и не использовать useEffect. Валидация/отправка не входят в задачу, пустые строки допустимы.
Крайние случаи: включить связь, изменить доставку, выключить связь; сначала изменить независимый адрес, затем переключать; пустая доставка в связанном режиме.
Время: 20–25 минут на обе версии.

## Как рассуждать
1. Почему копирование доставки в адрес оплаты потеряет полезные данные?
2. Какие три значения независимы?
3. Зачем полю и сводке одно производное значение?

## Примеры ответов вслух
«Храню независимый billingDraft даже когда показываю доставку. Если перезаписать его при включении checkbox, восстановить прежний адрес будет неоткуда».
«shipping и billingDraft — две независимые строки, sameAddress — правило выбора. effectiveBilling получу тернарным оператором при каждом обновлении».
«При изменении доставки пересчитывается рабочий адрес. Дополнительный setter или эффект не нужен. Поле и сводка читают effectiveBilling, поэтому не расходятся».
«В DOM обновляю value/disabled, в React задаю их props. Проверю восстановление черновика и пустую доставку без подстановки старого адреса».

## Пошаговый разбор
1. Заведи три независимых значения.
2. Вычисли effectiveBilling через тернарный оператор.
3. Свяжи доставку с shipping.
4. В отдельном режиме свяжи оплату с billingDraft.
5. Checkbox меняет только sameAddress.
6. В связанном режиме отобрази доставку и отключи редактирование оплаты.
7. Покажи сводку по тому же вычисленному адресу.

Ошибки: копировать shipping в billingDraft; хранить effectiveBilling отдельно; показывать в сводке старый billingDraft; читать value вместо checked у checkbox; подставлять старый адрес при пустой доставке.
Проверки: старт → Москва/Казань; изменить отдельную оплату на Тулу; включить → Москва/Москва; изменить доставку на Омск → Омск/Омск; выключить → Омск/Тула; очистить доставку при включённой связи → оплата тоже пустая.
Альтернатива: хранить строки одним объектом { shipping, billingDraft }, а флаг отдельно. Обновлять поле функциональным spread; рабочий адрес всё равно вычислять. Удобно для общего сброса и расширения формы, но обработчики требуют аккуратно сохранять соседние поля. Для двух строк отдельные переменные проще.

## Запуск
JavaScript: index.html. React: npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0.

[Сравнить с другой реализацией](../../react/task-38/).

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
  <title>Связанные адреса</title>
</head>
<body>
  <h1>Адреса заказа</h1>
  <label for="shipping">Адрес доставки</label>
  <input id="shipping">

  <label>
    <input id="same" type="checkbox">
    Адрес оплаты совпадает с доставкой
  </label>

  <label for="billing">Адрес оплаты</label>
  <input id="billing" aria-describedby="billing-hint">
  <p id="billing-hint"></p>
  <p id="summary"></p>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
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
```

</details>
