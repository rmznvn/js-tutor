import { useState } from "react";
const MAX_SELECTED_PLANS = 3;
const plans = [
  {id:1,name:"Start",price:1500,storage:10,users:2},
  {id:2,name:"Team",price:3500,storage:50,users:10},
  {id:3,name:"Business",price:7000,storage:200,users:30},
  {id:4,name:"Enterprise",price:12000,storage:500,users:100},
];
function PlanCard({ plan, isSelected, selectionIsFull, onToggle }) {
  return <article>
    <h2>{plan.name}</h2><p>{plan.price} ₽ в месяц</p>
    <p>Хранилище: {plan.storage} ГБ; пользователей: {plan.users}</p>
    <label><input type="checkbox" checked={isSelected}
      /* Выбранный checkbox остаётся доступен, чтобы можно было снять выбор. */
      disabled={selectionIsFull && !isSelected} onChange={() => onToggle(plan.id)} />Сравнить</label>
  </article>;
}
function Comparison({ selectedPlans, onRemove }) {
  return <section><h2>Сравнение</h2>
    {selectedPlans.length === 0 ? <p>Выберите до трёх тарифов.</p> :
      selectedPlans.map((plan) => <article key={plan.id}>
        <h3>{plan.name}</h3><p>Цена: {plan.price} ₽; {plan.storage} ГБ; {plan.users} пользователей</p>
        <button type="button" onClick={() => onRemove(plan.id)}>Убрать из сравнения</button>
      </article>)}
  </section>;
}
export default function PlanComparison() {
  const [selectedIds, setSelectedIds] = useState([]);
  // Массив объектов — производный, каталог не копируется в state.
  const selectedPlans = plans.filter((plan) => selectedIds.includes(plan.id));
  function togglePlan(id) {
    setSelectedIds((current) => {
      // Снятие выбора разрешено даже при полном наборе.
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_SELECTED_PLANS) return current;
      return [...current, id];
    });
  }
  return <main><h1>Тарифы</h1>
    <p>Выбрано: {selectedIds.length} из {MAX_SELECTED_PLANS}</p>
    {selectedIds.length >= MAX_SELECTED_PLANS && <p role="status">Достигнут максимальный выбор.</p>}
    <section aria-label="Доступные тарифы">
      {plans.map((plan) => <PlanCard key={plan.id} plan={plan}
        isSelected={selectedIds.includes(plan.id)}
        selectionIsFull={selectedIds.length >= MAX_SELECTED_PLANS} onToggle={togglePlan} />)}
    </section>
    <Comparison selectedPlans={selectedPlans}
      onRemove={(id) => setSelectedIds((current) => current.filter((item) => item !== id))} />
  </main>;
}
