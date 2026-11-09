import { useState } from "react";

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

export default function BillingPlans() {
  // Храним только период. Цены и экономию вычисляем.
  const [period, setPeriod] = useState("month");

  return (
    <main>
      <h1>Тарифы</h1>
      <fieldset>
        <legend>Период оплаты</legend>
        {["month", "year"].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="period"
              value={value}
              checked={period === value}
              onChange={(event) => setPeriod(event.target.value)}
            />
            {value === "month" ? "Месяц" : "Год"}
          </label>
        ))}
      </fieldset>
      <p role="status">
        {period === "month"
          ? "Показана оплата за месяц"
          : "Показана полная оплата за год"}
      </p>
      <ul>
        {plans.map((plan) => {
          const details = getPlanDetails(plan, period);
          return (
            <li key={plan.id}>
              <h2>{plan.title}</h2>
              <p>{details.priceLabel}</p>
              {/* Пустая строка скрывает подпись, но цена 0 остаётся видна. */}
              {details.savingLabel && <p>{details.savingLabel}</p>}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
