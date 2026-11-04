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
