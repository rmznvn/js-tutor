# Счётчик символов комментария — React

Выпуск **2026-10-14**. Время: **30–40 минут на обе версии**.

## Условие

Комментарий обязателен и не длиннее 120 символов; интерфейс показывает превышение.

### Входные данные и критерии готовности

- Считать исходную length, включая пробелы; trim только для проверки пустоты.
- Не ставить maxlength, чтобы превышение было достижимо.
- Чистая validateComment возвращает isValid, length, error.
- Невалидный ввод блокирует отправку.
- Успешная учебная отправка очищает поле; редактирование убирает прошлый успех.
- В React хранить только comment и successMessage; ошибка производная.

### Крайние случаи

- Пустой или пробельный текст.
- 120 символов допустимы, 121 — ошибка.
- " Текст " имеет длину 7.

## Как рассуждать

1. **Интервьюер:** «Как считать пробелы?»
2. **Интервьюер:** «Что хранить в state?»
3. **Интервьюер:** «Как защитить submit?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Считаю исходный текст; trim нужен только чтобы обнаружить строку без содержимого.»

> «Текст и сообщение об успехе. Длина, ошибка и isValid вычисляются из текста.»

> «В обработчике повторно использую проверку, даже если кнопка disabled. Проверю 0/120/121 и пробелы.»

## Пошаговый разбор

1. Написать чистую проверку.
2. Вычислить длину и пустоту.
3. Показать ошибку превышения.
4. Связать input и вывод.
5. При корректном submit очистить текст и показать учебное подтверждение.

## Типичные ошибки

- trim().length для счётчика.
- maxlength делает превышение невозможным.
- Три состояния для текста, длины и ошибки.

## Альтернативный способ

maxlength с required уменьшает JS и запрещает лишний ввод; собственная проверка позволяет сообщать число лишних символов.

## Ручная проверка

Проверь '', пробелы, 120/121 символ и сообщение после редактирования.

Вторая реализация: [JavaScript](../../Javascript/task-13/README.md).

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

### src/components/CommentForm.jsx

```jsx
import { useState } from "react";
const COMMENT_LIMIT = 120;
function validateComment(comment) {
  const length = comment.length; // Считаем также крайние пробелы.
  if (comment.trim() === "") return { isValid: false, length, error: "Введите комментарий." };
  if (length > COMMENT_LIMIT) return {
    isValid: false, length,
    error: "Сократите комментарий на " + (length - COMMENT_LIMIT) + " симв.",
  };
  return { isValid: true, length, error: "" };
}
export default function CommentForm() {
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Ошибка, длина и доступность кнопки пересчитываются из текста.
  const validation = validateComment(comment);
  function submit(event) {
    event.preventDefault();
    if (!validation.isValid) return;
    setComment("");
    setSuccessMessage("Учебный комментарий принят. Запрос на сервер не выполнялся.");
  }
  return <main><h1>Комментарий</h1><form onSubmit={submit} noValidate>
    <label htmlFor="comment">Комментарий</label>
    {/* maxlength намеренно отсутствует, чтобы можно было показать превышение. */}
    <textarea id="comment" rows={5} value={comment} onChange={(event) => {
      setComment(event.target.value);
      setSuccessMessage("");
    }} aria-invalid={!validation.isValid} aria-describedby="counter error" />
    <p id="counter">Использовано: {validation.length} из {COMMENT_LIMIT}</p>
    {/* Постоянный элемент гарантирует существующий адрес aria-describedby. */}
    <p id="error" role="alert">{validation.error}</p>
    <button type="submit" disabled={!validation.isValid}>Отправить</button>
    <p role="status">{successMessage}</p>
  </form></main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
