import { useState } from "react";

const initialItems = [
  { id: 1, name: "BIM Viewer", price: 1500, quantity: 1 },
  { id: 2, name: "Document Manager", price: 2500, quantity: 2 },
];
// Чистая функция: итог — сумма price * quantity.
// Начальное 0 также обеспечивает результат 0 для пустой корзины.
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
// Альтернатива reduce: обычный цикл с локальным аккумулятором.
function calculateTotalWithLoop(items) {
  let total = 0;
  for (const item of items) total += item.price * item.quantity;
  return total;
}

export default function Cart() {
  const [items, setItems] = useState(initialItems);
  // Итог вычисляем из товаров: отдельное состояние не требуется.
  const total = calculateTotal(items);
  function changeQuantity(id, delta) {
    // Функциональное обновление использует актуальное предыдущее состояние.
    setItems((currentItems) => currentItems.map((item) => {
      if (item.id !== id) return item;
      // Копируем изменяемый объект; минимум 1 защищаем также в обработчике.
      return { ...item, quantity: Math.max(1, item.quantity + delta) };
    }));
  }
  return (
    <section>
      <h1>Корзина</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>Цена лицензии: {item.price} ₽</p>
            {/* disabled ограничивает доступное действие в интерфейсе. */}
            <button type="button" disabled={item.quantity === 1}
              aria-label={`Уменьшить количество ${item.name}`}
              onClick={() => changeQuantity(item.id, -1)}>−</button>
            <span> {item.quantity} </span>
            <button type="button" aria-label={`Увеличить количество ${item.name}`}
              onClick={() => changeQuantity(item.id, 1)}>+</button>
            <p>Стоимость: {item.price * item.quantity} ₽</p>
          </li>
        ))}
      </ul>
      <p><strong>Итого: {total} ₽</strong></p>
      {/* Проверка альтернативы остаётся вычислением, без изменения состояния. */}
      <small>Проверка циклом: {calculateTotalWithLoop(items)} ₽</small>
    </section>
  );
}
