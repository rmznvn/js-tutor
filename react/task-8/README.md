# Список уведомлений — React

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

Вторая реализация той же задачи: [JavaScript](../../Javascript/task-7/README.md).

## Запуск

В терминале перейди в эту папку, затем выполни:

```bash
npm ci
npm run dev
```

Сборка: `npm run build`. Зависимости и lockfile взяты из существующего `react/task-1`. Компонент решения подключён через `src/App.jsx`.

## Полное решение с комментариями

Рабочий файл: [src/components/NotificationList.jsx](src/components/NotificationList.jsx). Код помещён в конце, чтобы можно было сначала решить задачу самостоятельно.

<details>
<summary>Показать полный код</summary>

```jsx
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
```

</details>
