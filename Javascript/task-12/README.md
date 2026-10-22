# Уведомления с автоматическим закрытием — JavaScript

Выпуск **2026-10-14**. Время: **35–45 минут**.

## Условие

Успех, ошибка и информация показываются на 4 секунды; доступно ручное закрытие.

### Входные данные и критерии готовности

- Новый объект с уникальным ID добавляется в начало массива.
- Несколько уведомлений одновременно; каждый таймер независим.
- Ручное удаление отменяет таймер; повторное удаление безопасно.
- Map связывает ID уведомления с ID таймера.
- DOM создаётся через createElement/textContent; один делегированный обработчик закрытия.

### Крайние случаи

- Быстрое создание трёх уведомлений.
- Ручное закрытие до 4 секунд.
- Удаление отсутствующего ID.

## Как рассуждать

1. **Интервьюер:** «Как связать таймер с уведомлением?»
2. **Интервьюер:** «Чем обеспечить ID?»
3. **Интервьюер:** «Зачем делегирование?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Map хранит пары ID → timerId; get находит таймер, clearTimeout отменяет, delete убирает запись.»

> «Локальный увеличивающийся счётчик уникален в текущем запуске; Date.now может совпасть.»

> «Один обработчик контейнера работает для будущих кнопок. closest определяет кнопку, Number преобразует dataset ID.»

## Пошаговый разбор

1. Создать массив, счётчик и Map.
2. Добавить объект и таймер setTimeout.
3. В удалении clearTimeout и Map.delete.
4. Отфильтровать объект.
5. Перерисовать и делегировать закрытие.

## Типичные ошибки

- Date.now как гарантия уникальности.
- Забытый clearTimeout.
- Новый обработчик контейнера при каждом render.

## Альтернативный способ

Отдельный callback на каждой кнопке проще для малого списка; делегирование уменьшает число обработчиков и не зависит от пересоздания элементов.

## Ручная проверка

Создай три, закрой второе вручную, дождись исчезновения остальных. Создай новое — старые таймеры не должны влиять.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const AUTO_CLOSE_DELAY = 4000;
let notifications = [];
let nextNotificationId = 1;
// Map хранит пары ID уведомления → идентификатор его таймера.
const notificationTimers = new Map();
const container = document.getElementById("notifications");
function showNotification(message, type = "info") {
  const notification = { id: nextNotificationId, message, type };
  nextNotificationId += 1; // Уникальность в текущем запуске страницы.
  notifications = [notification, ...notifications];
  const timerId = setTimeout(() => removeNotification(notification.id), AUTO_CLOSE_DELAY);
  notificationTimers.set(notification.id, timerId);
  render();
}
function removeNotification(id) {
  const timerId = notificationTimers.get(id);
  if (timerId !== undefined) {
    clearTimeout(timerId); // Ручное закрытие отменяет будущее удаление.
    notificationTimers.delete(id);
  }
  notifications = notifications.filter((item) => item.id !== id);
  render(); // Повторное удаление отсутствующего ID безопасно.
}
function render() {
  container.replaceChildren();
  notifications.forEach((notification) => {
    const item = document.createElement("article");
    const text = document.createElement("p");
    const close = document.createElement("button");
    item.className = "notification notification--" + notification.type;
    item.dataset.notificationId = String(notification.id);
    text.textContent = notification.message;
    close.type = "button";
    close.textContent = "Закрыть";
    close.dataset.close = "";
    close.setAttribute("aria-label", "Закрыть: " + notification.message);
    item.append(text, close);
    container.append(item);
  });
}
document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => showNotification(button.dataset.message, button.dataset.type));
});
// Один обработчик продолжает работать для вновь созданных кнопок.
container.addEventListener("click", (event) => {
  const close = event.target.closest("[data-close]");
  if (!close) return;
  const item = close.closest("[data-notification-id]");
  if (item) removeNotification(Number(item.dataset.notificationId));
});

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}.notification{padding:1rem;border:2px solid;margin:1rem 0}.notification--success{border-color:green}.notification--error{border-color:red}.notification--info{border-color:blue}</style></head>
<body><main><h1>Уведомления</h1><button type="button" data-message="Форма успешно отправлена" data-type="success">Успех</button><button type="button" data-message="Не удалось сохранить изменения" data-type="error">Ошибка</button><button type="button" data-message="Статья добавлена в избранное" data-type="info">Информация</button><div id="notifications" aria-live="polite" aria-label="Уведомления"></div></main><script src="./script.js"></script></body>
</html>

```

</details>
