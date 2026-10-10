# Список уведомлений — JavaScript

Материал из выпуска **2026-10-07**. Время: **40–50 минут на обе версии**.

## Условие

Пользователь отмечает отдельные уведомления или читает все сразу.

### Критерии готовности

- Все уведомления отображаются.
- Кнопка Прочитано видна только у read:false.
- Отдельное действие меняет только выбранный read на true.
- Прочитать все обновляет все непрочитанные.
- Количество непрочитанных вычисляется из массива.
- При нуле общая кнопка disabled; при пустом массиве сообщение Уведомлений нет.
- Изменения без мутаций.

### Ожидаемое поведение

| Действие | Непрочитано |
|---|---:|
| Начало | 2 |
| Прочитать уведомление 1 | 1 |
| Прочитать все | 0 |

### Крайние случаи

- Прочитанное нельзя снова отметить через интерфейс.
- Последнее прочтение блокирует общую кнопку.
- Пустой массив.

## Как рассуждать

1. **Интервьюер:** «Как изменить одно уведомление?»

2. **Интервьюер:** «Как прочитать все?»

3. **Интервьюер:** «Нужен ли отдельный счётчик?»

4. **Интервьюер:** «Чем отличается JS от React?»

Определи вход, результат и ограничения. Разбей действие на преобразование данных и отображение. Перед написанием кода предскажи результат на маленьком примере.

## Как отвечать на собеседовании

> «Применю map и создам копию только выбранного непрочитанного объекта.»

> «Пройду map по всем; сохраню уже прочитанные, остальным поставлю read:true в копии.»

> «Счётчик получу filter().length из актуальных уведомлений.»

> «В JS после смены переменной явно вызываю render. В React setter запускает рендер, JSX описывает новое состояние.»

## Пошаговый разбор

1. Хранить массив.
2. Вычислять непрочитанные.
3. Обновить выбранный объект через map и spread.
4. Для всех убрать проверку ID.
5. DOM: очистить прежний список, создать элементы и callbacks.
6. React: функциональные setters и ребёнок NotificationItem.
7. Показать пустое состояние и disabled.

## Типичные ошибки

- notification.read = true мутирует объект.
- forEach с прямыми изменениями не даёт неизменяемое обновление.
- Неочищенная DOM-разметка дублируется.
- Отдельный счётчик может устареть.

## Альтернативный способ

Можно хранить ID прочитанных отдельно. Это удобно для постоянного списка; read внутри объектов проще, если уведомления тоже изменяются.

## Проверка

Сопоставь результаты с таблицей выше и проверь каждый крайний случай. Для неизменяемых обновлений дополнительно проверь сохранение исходных данных и отсутствие влияния на соседние элементы.

Вторая реализация той же задачи: [React](../../react/task-8/README.md).

## Запуск

Открой `index.html` в браузере. Для задач на данные смотри DevTools → Console. Файл `script.js` содержит эталонное решение; для самостоятельной попытки сначала прочитай условие и создай свой файл.

## Полное решение с комментариями

Рабочий файл: [script.js](script.js). Код помещён в конце, чтобы можно было сначала решить задачу самостоятельно.

<details>
<summary>Показать полный код</summary>

```js
const initialNotifications = [
  { id: 1, text: "Опубликована новая статья", read: false },
  { id: 2, text: "Обновлена страница продукта", read: true },
  { id: 3, text: "Получена новая заявка", read: false },
];
// Следующие обновления создают новые массивы и изменённые объекты.
let notifications = initialNotifications;
const list = document.getElementById("notification-list");
const count = document.getElementById("unread-count");
const readAllButton = document.getElementById("read-all-button");

function markAsRead(id) {
  notifications = notifications.map((notification) => {
    // Уже прочитанные и остальные элементы не требуют нового объекта.
    if (notification.id !== id || notification.read) return notification;
    return { ...notification, read: true };
  });
  render(); // Изменение JS-переменной само не обновляет DOM.
}
function markAllAsRead() {
  notifications = notifications.map((notification) =>
    notification.read ? notification : { ...notification, read: true }
  );
  render();
}
function render() {
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  count.textContent = unreadCount;
  readAllButton.disabled = unreadCount === 0;
  list.replaceChildren(); // Не допускаем дублирования старой разметки.
  if (notifications.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Уведомлений нет";
    list.append(empty);
    return;
  }
  notifications.forEach((notification) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = notification.text;
    item.append(text);
    if (!notification.read) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Прочитано";
      // Callback помнит ID соответствующего уведомления.
      button.addEventListener("click", () => markAsRead(notification.id));
      item.append(" ", button);
    }
    list.append(item);
  });
}
readAllButton.addEventListener("click", markAllAsRead);
render();
```

</details>
