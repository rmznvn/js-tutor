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
