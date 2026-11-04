# React: управляемый компонент количества
Выпуск: 4 ноября 2026.

## Условие
Форма заказа содержит две услуги: «Консультация» — 1500 ₽, количество 1, диапазон 0–5; «Ревью проекта» — 2500 ₽, количество 0, диапазон 0–3.
Создай переиспользуемый QuantityControl с props label/value/min/max/onStep.
Кнопки минус/плюс изменяют значение на 1, на границах недоступны. Каждый счётчик независим. Родитель хранит массив услуг и вычисляет общую стоимость.
Готово: у дочернего компонента нет своего useState; он сообщает шаг -1/+1, родитель функционально обновляет массив без мутаций и ограничивает значение также в обработчике. Достаточно кнопок, ручного числового ввода нет.
Крайние случаи: уменьшение до 0; увеличение до лимита каждой услуги; все количества 0 → итог 0.
Время: 25–35 минут.

## Как рассуждать
1. Кто должен хранить количество, если оно нужно для общей суммы?
2. Зачем проверять границы, если кнопка уже disabled?
3. Что передавать родителю: новый массив или намерение изменить количество?

## Примеры ответов вслух
«Количество нужно общему итогу, поэтому храню его в родителе. Дочерний компонент управляется props, второй локальный state создал бы две версии одного значения».
«Через onStep передам -1 или 1. Родитель знает ID услуги и ограничения; внутри функционального setter рассчитает новое количество от актуального предыдущего».
«disabled описывает доступность кнопки, а ограничение в обработчике защищает данные. Math.max ограничит снизу, Math.min — сверху. Сумму пересчитаю через reduce».
«Проверю разные максимумы, независимость счётчиков и нулевой итог. При 1 консультации и 1 ревью ожидаю 4000 ₽».

## Пошаговый разбор
1. Создай чистый QuantityControl, читающий props.
2. Передай клики как шаг через callback.
3. В родителе через map найди изменяемую услугу.
4. Ограничь новое количество диапазоном.
5. Верни новый объект услуги и массив.
6. Вычисли итог через reduce.

Ошибки: копия количества в дочернем state; мутация item.quantity; общий флаг disabled для разных услуг; отдельное состояние total.
Проверки: старт 1500 ₽; добавить ревью → 4000 ₽; убрать консультацию → 2500 ₽; ревью максимум 3, консультация максимум 5; оба 0 → итог 0.
Альтернатива: onChange(nextValue). Это привычный API для контролов и удобно при добавлении input. Но если расчёт зависит от прежнего состояния, шаг позволяет выполнить его в функциональном setter родителя. Для строго кнопочного контрола выбран onStep.

## Запуск
В папке задачи: npm ci, npm run dev. В Codespaces: npm run dev -- --host 0.0.0.0, затем открой порт.

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### src/components/QuantityControl.jsx

```jsx
export default function QuantityControl({ label, value, min, max, onStep }) {
  // Компонент управляется props: собственного состояния количества нет.
  // Он сообщает намерение изменить значение, а родитель обновляет данные.
  return (
    <div role="group" aria-label={"Количество: " + label}>
      <button
        type="button"
        aria-label={"Уменьшить: " + label}
        disabled={value <= min}
        onClick={() => onStep(-1)}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label={"Увеличить: " + label}
        disabled={value >= max}
        onClick={() => onStep(1)}
      >
        +
      </button>
    </div>
  );
}
```

### src/App.jsx

```jsx
import { useState } from "react";
import QuantityControl from "./components/QuantityControl.jsx";

const initialItems = [
  { id: "session", title: "Консультация", price: 1500, quantity: 1, min: 0, max: 5 },
  { id: "review", title: "Ревью проекта", price: 2500, quantity: 0, min: 0, max: 3 },
];

export default function ServiceOrder() {
  const [items, setItems] = useState(initialItems);

  function changeQuantity(id, delta) {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;

      // Считаем от актуального предыдущего состояния.
      // Границы проверяются и здесь, независимо от disabled.
      const quantity = Math.min(
        item.max,
        Math.max(item.min, item.quantity + delta)
      );
      return { ...item, quantity };
    }));
  }

  // Итог — производное значение, отдельный state ему не нужен.
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main>
      <h1>Заказ услуг</h1>
      {items.map((item) => (
        <section key={item.id}>
          <h2>{item.title}</h2>
          <p>Цена: {item.price} ₽. Максимум: {item.max}.</p>
          <QuantityControl
            label={item.title}
            value={item.quantity}
            min={item.min}
            max={item.max}
            // Callback связывает универсальный компонент с конкретной услугой.
            onStep={(delta) => changeQuantity(item.id, delta)}
          />
        </section>
      ))}
      <p role="status">Итого: {total} ₽</p>
    </main>
  );
}
```

</details>
