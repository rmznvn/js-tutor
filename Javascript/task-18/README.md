# Автосохранение черновика формы — JavaScript

Выпуск **2026-10-21**. Время: **35–45 минут**.

## Условие

Заголовок и текст сохраняются в localStorage через 700 мс после паузы ввода.

### Входные данные и критерии готовности

- Debounce: каждый input отменяет предыдущий таймер.
- Статусы несохранённых изменений / сохранено / ошибка.
- JSON.stringify для объекта, JSON.parse при восстановлении.
- try/catch и проверка структуры.
- Пустой черновик удаляется; одного заполненного поля достаточно.
- Очистка отменяет таймер, очищает поля и ключ.
- До истечения 700 мс последние изменения могут потеряться при уходе — это ограничение примера.

### Крайние случаи

- Быстрый ввод.
- Повреждённый JSON.
- Очистка до таймера; одно поле заполнено.

## Как рассуждать

1. **Интервьюер:** «Где хранить таймер?»
2. **Интервьюер:** «Как хранить объект?»
3. **Интервьюер:** «Что проверять при чтении?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Снаружи обработчика, чтобы следующий input мог clearTimeout; запись выполнится после паузы.»

> «JSON.stringify сериализует объект в строку, JSON.parse восстанавливает.»

> «try/catch плюс typeof строковых полей: корректный JSON ещё не гарантирует нужную структуру. Проверю null и повреждённую строку.»

## Пошаговый разбор

1. Определить ключ и delay.
2. Читать текущие поля.
3. Написать save/read/restore.
4. На input отменять и запускать таймер.
5. При пустоте удалять запись.
6. Очистка отменяет таймер и удаляет ключ.

## Типичные ошибки

- Таймер локальный внутри каждого события.
- Объект без JSON.stringify.
- Считать debounce гарантией сохранения при мгновенном закрытии.

## Альтернативный способ

Сохранять при change/blur проще без таймера; данные не пишутся до события. Debounce даёт сохранение во время работы после паузы, но тоже не гарантирует последний ввод при немедленном уходе.

## Ручная проверка

Быстрый ввод → одно сохранение после паузы; обнови и восстанови; очисти до таймера; проверь плохой JSON.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const STORAGE_KEY = "articleDraft";
const SAVE_DELAY = 700;
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusElement = document.getElementById("status");
const form = document.getElementById("article-form");
// Внешняя переменная позволяет отменить предыдущий таймер.
let saveTimerId = null;
function getCurrentDraft() {
  return { title: titleInput.value, content: contentInput.value };
}
function draftHasContent(draft) {
  return draft.title.trim() !== "" || draft.content.trim() !== "";
}
function saveDraft(draft) {
  try {
    if (!draftHasContent(draft)) {
      localStorage.removeItem(STORAGE_KEY);
      statusElement.textContent = "Пустой черновик не сохранён.";
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    statusElement.textContent = "Черновик сохранён.";
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Не удалось сохранить черновик.";
  }
}
function readDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return null;
    const draft = JSON.parse(saved); // Может выбросить исключение.
    // Корректный JSON ещё не гарантирует ожидаемые поля.
    if (typeof draft !== "object" || draft === null ||
        typeof draft.title !== "string" || typeof draft.content !== "string") return null;
    return draft;
  } catch (error) { console.warn(error); return null; }
}
function restoreDraft() {
  const draft = readDraft();
  if (!draft) { statusElement.textContent = "Сохранённого черновика нет."; return; }
  titleInput.value = draft.title;
  contentInput.value = draft.content;
  statusElement.textContent = "Черновик восстановлен.";
}
function scheduleDraftSave() {
  if (saveTimerId !== null) clearTimeout(saveTimerId);
  statusElement.textContent = "Есть несохранённые изменения.";
  saveTimerId = setTimeout(() => {
    saveDraft(getCurrentDraft()); // Читаем актуальные поля после паузы.
    saveTimerId = null;
  }, SAVE_DELAY);
}
form.addEventListener("input", scheduleDraftSave);
form.addEventListener("submit", (event) => event.preventDefault());
document.getElementById("clear").addEventListener("click", () => {
  // Отменяем отложенную операцию при явной очистке.
  if (saveTimerId !== null) clearTimeout(saveTimerId);
  saveTimerId = null;
  titleInput.value = "";
  contentInput.value = "";
  try {
    localStorage.removeItem(STORAGE_KEY);
    statusElement.textContent = "Черновик очищен.";
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Поля очищены, но хранилище недоступно.";
  }
  titleInput.focus();
});
restoreDraft();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Черновик статьи</h1><form id="article-form"><label for="title">Заголовок</label><input id="title" type="text"><label for="content">Текст статьи</label><textarea id="content" rows="8"></textarea><p id="status" role="status"></p><button id="clear" type="button">Очистить черновик</button></form></main><script src="./script.js"></script></body>
</html>

```

</details>
