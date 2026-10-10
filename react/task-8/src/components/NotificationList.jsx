import { useState } from "react";

const initialNotifications = [
  { id: 1, text: "Опубликована новая статья", read: false },
  { id: 2, text: "Обновлена страница продукта", read: true },
  { id: 3, text: "Получена новая заявка", read: false },
];
function NotificationItem({ notification, onRead }) {
  return (
    <li>
      <span>{notification.text}</span>
      {/* После прочтения кнопка исчезает: повторного действия нет. */}
      {!notification.read && (
        <button type="button" onClick={() => onRead(notification.id)}>Прочитано</button>
      )}
    </li>
  );
}
export default function NotificationList() {
  const [notifications, setNotifications] = useState(initialNotifications);
  // Счётчик выводим из данных, не храним отдельно.
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  function markAsRead(id) {
    setNotifications((current) => current.map((notification) => {
      if (notification.id !== id || notification.read) return notification;
      // Копируем только изменяемое уведомление.
      return { ...notification, read: true };
    }));
  }
  function markAllAsRead() {
    setNotifications((current) => current.map((notification) =>
      notification.read ? notification : { ...notification, read: true }
    ));
  }
  return (
    <section>
      <h1>Уведомления</h1>
      <p>Непрочитанных: {unreadCount}</p>
      <button type="button" disabled={unreadCount === 0} onClick={markAllAsRead}>
        Прочитать все
      </button>
      {notifications.length === 0 ? <p>Уведомлений нет</p> : (
        <ul>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
          ))}
        </ul>
      )}
    </section>
  );
}
