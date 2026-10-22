# Счётчик символов комментария — JavaScript

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

Вторая реализация: [React](../../react/task-14/README.md).

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
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
const form = document.getElementById("comment-form");
const input = document.getElementById("comment");
const counter = document.getElementById("counter");
const errorElement = document.getElementById("error");
const submit = document.getElementById("submit");
const statusElement = document.getElementById("status");
function render() {
  const validation = validateComment(input.value);
  counter.textContent = "Использовано: " + validation.length + " из " + COMMENT_LIMIT;
  errorElement.textContent = validation.error;
  submit.disabled = !validation.isValid;
  input.setAttribute("aria-invalid", String(!validation.isValid));
}
input.addEventListener("input", () => { statusElement.textContent = ""; render(); });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateComment(input.value).isValid) { render(); return; }
  input.value = "";
  render(); // Счётчик и кнопка соответствуют новому пустому значению.
  statusElement.textContent = "Учебный комментарий принят. Запрос на сервер не выполнялся.";
  input.focus();
});
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Комментарий</h1><form id="comment-form" novalidate><label for="comment">Комментарий</label><textarea id="comment" rows="5" aria-describedby="counter error"></textarea><p id="counter"></p><p id="error" role="alert"></p><button id="submit" type="submit">Отправить</button><p id="status" role="status"></p></form></main><script src="./script.js"></script></body>
</html>

```

</details>
