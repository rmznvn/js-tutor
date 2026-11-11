# React: история масштаба с отменой и повтором
Выпуск: 11 ноября 2026.

## Условие
В редакторе карточки есть текстовый предпросмотр. Его масштаб стартует со 100%, меняется по 25%, допустимы 50–150%.
Добавь Уменьшить/Увеличить и Отменить/Повторить. Кнопки на границах недоступны.
Каждое реальное изменение масштаба создаёт снимок. Undo/redo перемещаются по истории без создания записей. Новое изменение после undo удаляет прежние будущие снимки.
Покажи масштаб и позицию в истории. Размер текста предпросмотра должен соответствовать масштабу.
Готово: state { values:[100], index:0 }; текущий zoom вычисляется; обновления функциональные и неизменяемые. Нажатие у границы не добавляет одинаковый снимок.
Крайние случаи: начальные undo/redo недоступны; отменить и повторить несколько раз; отменить, сделать новое изменение — прежнее будущее недоступно.
Время: 30–40 минут.

## Как рассуждать
1. Зачем нужны массив снимков и курсор?
2. Должна ли отмена добавлять новый снимок?
3. Что делать с историей после нового действия из прошлого?

## Примеры ответов вслух
«Сохраню values и index одним объектом. Текущий масштаб — values[index], отдельный state zoom не нужен».
«Отмена уменьшает index, повтор увеличивает. Если добавлять снимок при отмене, история начнёт описывать саму навигацию, а не изменения».
«При новом масштабе возьму slice до index включительно и добавлю next. Так старое будущее исчезнет, а новая запись станет последней».
«Границы ограничу через min/max в обработчике. Если next равен предыдущему, верну прежнее состояние. Проверю ветвление и что undo/redo не увеличивают длину истории».

## Пошаговый разбор
1. Создай history со стартовым снимком.
2. Вычисли текущий zoom по index.
3. При изменении вычисли допустимый next.
4. Если он прежний, ничего не добавляй.
5. Скопируй историю до текущего снимка и добавь next.
6. Undo/redo меняют только index в допустимых пределах.
7. Выведи состояние кнопок и fontSize предпросмотра.

Ошибки: хранить отдельно zoom; push в state.values; добавлять историю при undo; сохранять старое будущее после нового изменения; путать количество снимков с индексом.
Проверки: 100→125→150; undo→125; redo→150; undo→125; уменьшить→100, redo недоступен. На 50/150 соответствующая кнопка заблокирована.
Альтернатива: два стека past/future и present. Удобно для сложных редакторов: undo переносит настоящее в future. Но нужно согласованно обновлять три части. Для числовых снимков массив и курсор компактнее. История учебная, хранится только в памяти.

## Запуск
npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0 и открой порт.

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### src/App.jsx

```jsx
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
```

</details>
