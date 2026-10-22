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
