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
