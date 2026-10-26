# Рейтинг с предпросмотром — React

Выпуск **2026-10-26**. Время: 35–45 минут на обе версии.

## Условие

Пять звёзд дают временный предпросмотр при наведении или фокусе; только нажатие сохраняет оценку.

### Входные данные и критерии готовности

- Значения от 1 до 5; rating=0 — оценка не выбрана, preview=null — нет предпросмотра.
- Подсвечиваются звёзды от 1 до preview ?? rating.
- Наведение/фокус меняет только preview; клик/Enter/Space сохраняет rating.
- После ухода указателя или потери фокуса предпросмотр сбрасывается, выбранная оценка остаётся.
- Текст «Ваша оценка» показывает только сохранённый rating.
- Очистка сбрасывает оба значения; при rating=0 она disabled.
- Нативные button с постоянными доступными именами; aria-pressed=true только у выбранного значения. Без роли radio и сложной клавиатурной навигации.

### Крайние случаи

- Навести 5, не нажимать — оценка не сохраняется.
- Выбрать 2, навести 4, уйти — вернётся подсветка 2.
- Установить с клавиатуры и очистить.

## Как рассуждать

- Чем различаются rating и preview?
- Нужно ли хранить число подсвеченных звёзд?
- Почему важно не пересоздавать кнопки в DOM?

Перед кодом определи вход, результат одного действия и ограничения. Отдели хранимые значения от производных; предскажи поведение на маленьком примере.

## Примеры ответов вслух

> «rating — подтверждённый выбор, preview — временный указатель. При наведении сохранённая оценка и текст статуса не меняются.»

> «Нет: visibleRating = preview ?? rating. null означает отсутствие предпросмотра; отдельное состояние подсветки потребовало бы синхронизации.»

> «Если удалять и создавать фокусированную кнопку заново, клавиатурный фокус потеряется. В JS создам кнопки один раз, а render обновит классы и aria-pressed. В React стабильный key сохраняет соответствие.»

## Пошаговый разбор

1. Создать rating и preview.
2. Вычислить видимое значение через ??.
3. Создать пять нативных кнопок.
4. Подключить mouseenter/focus для предпросмотра.
5. Подключить click для сохранения; mouseleave/blur для сброса предпросмотра.
6. Вывести подтверждённый статус.
7. Добавить очистку обоих значений.

## Типичные ошибки

- Сохранять rating при наведении.
- Считать все подсвеченные звёзды aria-pressed=true.
- Пересоздавать DOM-кнопки на каждом фокусе.
- Использовать только мышь без нативных кнопок и focus.

## Альтернативный способ

Нативная группа radio лучше выражает выбор одного значения и поддерживает стрелки, но hover-подсветку всё равно нужно проектировать отдельно. Группа обычных кнопок подходит этому компактному упражнению; не добавляй role=radio без соответствующей клавиатурной логики.

## Ручная проверка

Наведи 5 без клика — статус не выбран. Выбери 2, наведи 4 и уйди — подсветка 2. Tab к звезде, Enter/Space выбирает. Очисти: rating=0, нет выбранных кнопок.

Другая версия: [JavaScript](../../Javascript/task-23/README.md).

## Запуск

Из папки задачи: `npm ci`, затем `npm run dev`. В Codespaces: `npm run dev -- --host 0.0.0.0`, затем Open in Browser. Сборка: `npm run build`.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### src/components/RatingDemo.jsx

```jsx
import { useState } from "react";

function StarRating() {
  const [rating, setRating] = useState(0);
  const [preview, setPreview] = useState(null);
  // Подсветка производна от двух состояний; хранить её отдельно не нужно.
  const visibleRating = preview ?? rating;
  const scores = [1, 2, 3, 4, 5];

  function selectRating(score) {
    setRating(score);
    setPreview(null);
  }

  function clearRating() {
    setRating(0);
    setPreview(null);
  }

  return (
    <section aria-label="Оценка материала">
      <div className="stars" role="group" aria-label="Выберите оценку"
        onMouseLeave={() => setPreview(null)}>
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            className={score <= visibleRating ? "is-filled" : ""}
            aria-label={"Оценить на " + score + " из 5"}
            aria-pressed={score === rating}
            onMouseEnter={() => setPreview(score)}
            onFocus={() => setPreview(score)}
            onBlur={() => setPreview(null)}
            onClick={() => selectRating(score)}
          >
            {/* Цвет показывает предпросмотр, aria-pressed — сохранённый выбор. */}
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>
      <p role="status">
        {rating === 0 ? "Оценка не выбрана" : "Ваша оценка: " + rating + " из 5"}
      </p>
      <button type="button" disabled={rating === 0} onClick={clearRating}>Очистить оценку</button>
    </section>
  );
}

export default function RatingDemo() {
  return <main><h1>Оцените материал</h1><StarRating /></main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}
.theme-panel{padding:2rem;color:#1c1f2c;background:#fff;border:1px solid #d8dde3}.theme-panel.is-dark{color:#fff;background:#10131f;border-color:#545969}

select{font:inherit;padding:.5rem} button:disabled{opacity:.6}

/* Цвет относится только к визуальной подсветке, не к сохранённой оценке. */
.stars button { font-size: 2rem; color: #626876; background: white; border: 1px solid #bbb; }
.stars button.is-filled { color: #986000; }
.stars button:focus-visible { outline: 3px solid #2457d6; outline-offset: 2px; }

```

</details>
