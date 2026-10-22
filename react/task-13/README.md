# Сравнение тарифов с ограничением выбора — React

Выпуск **2026-10-14**. Время: **35–45 минут**.

## Условие

Пользователь сравнивает до трёх из четырёх тарифов.

### Входные данные и критерии готовности

- Start 1500/10ГБ/2 пользователя; Team 3500/50/10; Business 7000/200/30; Enterprise 12000/500/100.
- Хранить только выбранные ID; объекты получать filter.
- При выборе трёх блокировать только невыбранные checkbox.
- Выбранные можно снять; убрать также из блока сравнения.
- Счётчик N из 3 и подсказка при пустом выборе.
- Лимит проверяется также внутри updater.

### Крайние случаи

- Попытка четвёртого выбора.
- Снятие после достижения лимита.
- Удаление из сравнения синхронизирует карточку.

## Как рассуждать

1. **Интервьюер:** «Что является источником правды?»
2. **Интервьюер:** «Какие checkbox блокировать?»
3. **Интервьюер:** «Почему проверка внутри setter?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Массив ID. selectedPlans и счётчик вычислю из него, чтобы не дублировать данные.»

> «Только невыбранные, если лимит достигнут. Иначе пользователь не сможет снять выбор.»

> «Функциональный updater использует актуальный выбор и защищает правило независимо от disabled.»

## Пошаговый разбор

1. Создать selectedIds.
2. Вычислить объекты и полноту выбора.
3. Сначала разрешить снятие.
4. Затем проверить лимит.
5. Добавить через spread.
6. Отдельно реализовать remove для сравнения.

## Типичные ошибки

- Блокировать выбранные checkbox.
- push в state.
- Отдельный state счётчика.

## Альтернативный способ

selected внутри объектов упрощает доступ к флагу, но смешивает каталог с временным выбором и требует map при каждом клике.

## Ручная проверка

Выбери три, сними один, добавь четвёртый; убери из сравнения и проверь checkbox.

## Запуск

В терминале из этой папки:

```sh
npm ci
npm run dev
```

Сборка: `npm run build`. Это самостоятельный Vite-проект; корень репозитория не содержит общего npm-приложения.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### src/components/PlanComparison.jsx

```jsx
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

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
