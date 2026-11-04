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
