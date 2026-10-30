import { useState } from "react";

const initialSettings = {
  language: "ru",
  notifications: { email: true, browser: false },
};

export default function NotificationSettings() {
  const [settings, setSettings] = useState(initialSettings);

  // Количество зависит от двух флагов: отдельный state не нужен.
  const enabledCount =
    Number(settings.notifications.email) +
    Number(settings.notifications.browser);

  function changeChannel(channel, checked) {
    setSettings((current) => ({
      // Сохраняем соседнее поле language.
      ...current,
      notifications: {
        // Spread снаружи не копирует вложенный объект.
        // Этот spread сохраняет второй канал и создаёт новый объект.
        ...current.notifications,
        // Вычисляемое имя свойства обновляет нужный канал.
        [channel]: checked,
      },
    }));
  }

  return (
    <main>
      <h1>Настройки уведомлений</h1>
      <label>
        Язык интерфейса
        <select
          value={settings.language}
          onChange={(event) => {
            // Читаем строку из события до передачи функции обновления.
            const language = event.target.value;
            setSettings((current) => ({ ...current, language }));
          }}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </label>

      <fieldset>
        <legend>Каналы уведомлений</legend>
        {["email", "browser"].map((channel) => (
          <label key={channel}>
            <input
              type="checkbox"
              // checked управляет checkbox; value не задаёт его отметку.
              checked={settings.notifications[channel]}
              onChange={(event) =>
                changeChannel(channel, event.target.checked)
              }
            />
            {channel === "email" ? "Email" : "В браузере"}
          </label>
        ))}
      </fieldset>

      {/* Счётчик всегда соответствует текущим флагам. */}
      <p role="status">Включено каналов: {enabledCount}</p>
      <button
        type="button"
        onClick={() => {
          // Возвращаем начальные значения и создаём оба уровня заново.
          setSettings({
            ...initialSettings,
            notifications: { ...initialSettings.notifications },
          });
        }}
      >
        Сбросить настройки
      </button>
      <p>Учебные настройки действуют до перезагрузки страницы.</p>
    </main>
  );
}
