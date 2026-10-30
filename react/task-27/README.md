# React: вложенные настройки уведомлений
Выпуск: 30 октября 2026.

## Условие
В личном кабинете есть язык и два независимых канала уведомлений.
Начальные данные: { language: "ru", notifications: { email: true, browser: false } }.
Сделай select языка ru/en, два checkbox, счётчик включённых каналов и сброс.
Изменение канала сохраняет второй канал и язык. Сброс возвращает исходные значения.
Готово, если настройки хранятся одним объектом; обновления неизменяемые, функциональные; количество вычисляется. Настройки только в памяти.
Крайние случаи: оба канала выключены; оба включены; смена языка и канала с последующим сбросом.
Время: 25–35 минут.

## Как рассуждать
1. Достаточно ли одного spread на внешнем объекте?
2. Как обновить один из каналов общим обработчиком?
3. Нужно ли хранить счётчик отдельно?

Подумай, какие объекты находятся по ссылкам внутри settings. Определи, на каких уровнях создаются новые объекты.

## Примеры ответов вслух
«Spread создаёт поверхностную копию. Если скопирую только settings, notifications останется прежним объектом. Создам новые settings и notifications, сохранив соседние поля на каждом уровне».
«Использую [channel] — вычисляемое имя свойства. Если channel равен email, обновится email. Для checkbox читаю checked: это boolean, в отличие от value».
«Количество вычислю из флагов через Number: true станет 1, false — 0. Функциональный setter получит актуальное состояние. Проверю, что включение browser не изменяет email и язык, а сброс возвращает 1 канал».

## Пошаговый разбор
1. Создай единый объект состояния с вложенными флагами.
2. Свяжи select с language, checkbox с checked.
3. В обновлении канала скопируй внешний и вложенный объекты.
4. Используй [channel] для выбранного свойства.
5. Вычисли количество без дополнительного состояния.
6. Для сброса создай свежие объекты с исходными значениями.

Ошибки: current.notifications.email = checked мутирует состояние; notifications: { [channel]: checked } теряет второй флаг; value вместо checked управляет не отметкой.
Проверки: старт → 1; включить browser → 2; выключить email → 1; выключить browser → 0. Выбрать en, включить email: язык остаётся en. Сброс → ru, email true, browser false.
Альтернатива: три независимых useState. Для такой небольшой формы это проще и без вложенного spread. Но общий объект удобнее передавать целиком и расширять группами полей; плоские состояния придётся собирать при передаче.

## Запуск
В папке задачи: npm ci, затем npm run dev. В Codespaces: npm run dev -- --host 0.0.0.0 и открой предложенный порт.

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### src/App.jsx

```jsx
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
```

</details>
