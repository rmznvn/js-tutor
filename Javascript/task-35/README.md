# JavaScript → React: месячная и годовая оплата
Выпуск: 9 ноября 2026.

## Условие
Тарифы: «Старт» month=0/year=0; «Личный» month=1000/year=10000; «Команда» month=2000/year=20000.
Сделай переключатель radio «Месяц/Год», изначально month, и карточки тарифов в DOM/React.
Месячный режим показывает цену за месяц. Годовой — ПОЛНЫЙ платёж за год. В годовом режиме покажи экономию относительно 12 месячных платежей, только если она положительная.
Для «Старт» цена 0 видна в обоих режимах. Отрицательных цен и отсутствующих полей в данных нет; year <= month*12; period только month/year.
Готово: хранить только period; подписи и экономию вычислять, обе версии используют одинаковую getPlanDetails(plan, period). Существующие данные не менять.
Крайние случаи: нулевая цена; месяц→год→месяц; экономия 0 не создаёт пустого сообщения.
Время: 20–25 минут на обе версии.

## Как рассуждать
1. Что именно означает годовая цена?
2. Нужно ли хранить второй массив тарифов в состоянии?
3. Как избежать потери нулевой цены?

## Примеры ответов вслух
«year — полный годовой платёж. Не подпишу его как цену за месяц. Экономию вычислю как month*12 - year».
«Храню только period. Из plan.prices[period] получу нужное число, подпись и экономия будут производными. Массив тарифов остаётся неизменным».
«Цена 0 допустима, поэтому не использую price || запасноеЗначение. Для экономии проверю >0 и покажу подпись только в годовом режиме».
«Использую нативную radio-группу: name одинаковый, value разный. В DOM слушаю change, в React controlled checked. Проверю полный годовой платёж, возврат к месяцу и бесплатный тариф».

## Пошаговый разбор
1. Опиши фиксированные тарифы и period=month.
2. Напиши общий вычислитель getPlanDetails.
3. Возьми цену по вычисляемому ключу prices[period].
4. Подпиши месяц или год без неоднозначности.
5. Посчитай экономию относительно 12 месяцев.
6. Событием change обнови только period.
7. В DOM обнови список, сохранив radio; в React отрисуй данные из состояния.

Ошибки: выдавать полную годовую цену за месячную; сравнивать годовую цену с одним месяцем; потерять 0 через ||; хранить дублирующее состояние цен; пересоздавать переключатель при render.
Проверки: старт Личный 1000 ₽/месяц; год → 10000 ₽/год и экономия 2000; Команда → 20000 и 4000; Старт → 0 без экономии; назад → месячные цены без подписи экономии.
Альтернатива: показывать эквивалентную месячную цену year/12 с пояснением «при оплате за год» и отдельным полным платежом. Удобно для сравнения тарифов, но добавляет округление и риск непонятной суммы списания. В задаче показываем непосредственно сумму за выбранный период.

## Запуск
JavaScript: index.html. React: npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0.

[Другая реализация](../../react/task-36/).

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
  <title>Период оплаты</title>
</head>
<body>
  <h1>Тарифы</h1>
  <fieldset id="period">
    <legend>Период оплаты</legend>
    <label><input type="radio" name="period" value="month" checked>Месяц</label>
    <label><input type="radio" name="period" value="year">Год</label>
  </fieldset>
  <p id="period-status" role="status"></p>
  <ul id="plans"></ul>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
const plans = [
  { id: "free", title: "Старт", prices: { month: 0, year: 0 } },
  { id: "solo", title: "Личный", prices: { month: 1000, year: 10000 } },
  { id: "team", title: "Команда", prices: { month: 2000, year: 20000 } },
];

function getPlanDetails(plan, period) {
  // period — только month или year, заданные переключателем.
  // Годовая цена — полный платёж за год, не цена одного месяца.
  const price = plan.prices[period];
  const priceLabel = price + (period === "month" ? " ₽ / месяц" : " ₽ / год");
  const saving = plan.prices.month * 12 - plan.prices.year;

  return {
    priceLabel,
    // Сравниваем оплату одного года с 12 месячными платежами.
    // Для бесплатного тарифа экономия 0, подпись не нужна.
    savingLabel: period === "year" && saving > 0
      ? "Экономия за год: " + saving + " ₽"
      : "",
  };
}

let period = "month";
const list = document.getElementById("plans");
const status = document.getElementById("period-status");

function render() {
  status.textContent = period === "month"
    ? "Показана оплата за месяц"
    : "Показана полная оплата за год";
  // Радиокнопки находятся вне списка: фокус при рендере не теряется.
  list.replaceChildren();

  plans.forEach((plan) => {
    const details = getPlanDetails(plan, period);
    const item = document.createElement("li");
    const heading = document.createElement("h2");
    const price = document.createElement("p");
    heading.textContent = plan.title;
    price.textContent = details.priceLabel;
    item.append(heading, price);

    if (details.savingLabel) {
      const saving = document.createElement("p");
      saving.textContent = details.savingLabel;
      item.append(saving);
    }
    list.append(item);
  });
}

document.getElementById("period").addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches('input[name="period"]')) return;
  period = input.value;
  render();
});
render();
```

</details>
