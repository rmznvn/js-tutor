# Рейтинг с предпросмотром — JavaScript

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

Другая версия: [React](../../react/task-24/README.md).

## Запуск

Открой index.html. Чистая функция выводит примеры в DevTools → Console.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### script.js

```js
const stars = document.getElementById("stars");
const chosen = document.getElementById("chosen");
const clearButton = document.getElementById("clear");
let rating = 0; // Ноль означает, что оценка ещё не выбрана.
let preview = null; // null означает отсутствие временного предпросмотра.

// Кнопки создаём один раз: render меняет свойства и не теряет фокус.
for (let score = 1; score <= 5; score += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "★";
  button.dataset.score = String(score);
  button.setAttribute("aria-label", "Оценить на " + score + " из 5");
  button.addEventListener("mouseenter", () => { preview = score; render(); });
  button.addEventListener("focus", () => { preview = score; render(); });
  button.addEventListener("blur", () => { preview = null; render(); });
  button.addEventListener("click", () => {
    rating = score; // Только подтверждённое действие сохраняет оценку.
    preview = null;
    render();
  });
  stars.append(button);
}

function render() {
  // ?? использует выбранную оценку только при отсутствии предпросмотра.
  const visibleRating = preview ?? rating;
  stars.querySelectorAll("button").forEach((button) => {
    const score = Number(button.dataset.score);
    button.classList.toggle("is-filled", score <= visibleRating);
    // Нажатой считается ровно выбранная оценка, а не все подсвеченные звёзды.
    button.setAttribute("aria-pressed", String(score === rating));
  });
  chosen.textContent = rating === 0 ? "Оценка не выбрана" : "Ваша оценка: " + rating + " из 5";
  clearButton.disabled = rating === 0;
}

stars.addEventListener("mouseleave", () => { preview = null; render(); });
clearButton.addEventListener("click", () => {
  rating = 0;
  preview = null;
  render();
});
render();

```

### index.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Рейтинг</title><style>body{font-family:system-ui;max-width:50rem;margin:auto;padding:2rem}button{font:inherit;margin:.3rem}/* Цвет относится только к визуальной подсветке, не к сохранённой оценке. */
.stars button { font-size: 2rem; color: #626876; background: white; border: 1px solid #bbb; }
.stars button.is-filled { color: #986000; }
.stars button:focus-visible { outline: 3px solid #2457d6; outline-offset: 2px; }
</style></head><body><main><h1>Оцените материал</h1><div id="stars" class="stars" role="group" aria-label="Выберите оценку"></div><p id="chosen" role="status"></p><button id="clear" type="button">Очистить оценку</button></main><script src="./script.js"></script></body></html>

```

</details>
