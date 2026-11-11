import { useState } from "react";

const MIN = 50;
const MAX = 150;
const STEP = 25;

export default function ZoomHistory() {
  // values — снимки масштаба, index — текущая позиция в истории.
  const [history, setHistory] = useState({ values: [100], index: 0 });
  const zoom = history.values[history.index];

  function changeZoom(delta) {
    setHistory((current) => {
      const previous = current.values[current.index];
      const next = Math.min(MAX, Math.max(MIN, previous + delta));

      // Нажатие у границы не создаёт повторяющийся снимок.
      if (next === previous) return current;

      // Новое действие после отмены отбрасывает старое «будущее».
      const values = [...current.values.slice(0, current.index + 1), next];
      return { values, index: values.length - 1 };
    });
  }

  function moveHistory(delta) {
    setHistory((current) => ({
      ...current,
      // Undo/redo меняют только курсор, не создают новую запись.
      index: Math.min(
        Math.max(current.index + delta, 0),
        current.values.length - 1
      ),
    }));
  }

  return (
    <main>
      <h1>Масштаб предпросмотра</h1>
      <div role="group" aria-label="Изменить масштаб">
        <button type="button" disabled={zoom <= MIN} onClick={() => changeZoom(-STEP)}>
          Уменьшить
        </button>
        <button type="button" disabled={zoom >= MAX} onClick={() => changeZoom(STEP)}>
          Увеличить
        </button>
      </div>
      <div role="group" aria-label="История изменений">
        <button type="button" disabled={history.index === 0} onClick={() => moveHistory(-1)}>
          Отменить
        </button>
        <button
          type="button"
          disabled={history.index === history.values.length - 1}
          onClick={() => moveHistory(1)}
        >
          Повторить
        </button>
      </div>
      {/* Масштаб вычисляется из снимка, отдельный state zoom не нужен. */}
      <p role="status">
        Масштаб: {zoom}%. Шаг: {history.index + 1} из {history.values.length}
      </p>
      <section aria-label="Предпросмотр">
        <p style={{ fontSize: zoom + "%" }}>Заголовок карточки</p>
      </section>
    </main>
  );
}
