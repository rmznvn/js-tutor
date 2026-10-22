import { useState } from "react";
export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  // Класс и тексты выводятся из одного boolean, не требуют отдельных setters.
  const status = isDark ? "Сейчас включена тёмная тема." : "Сейчас включена светлая тема.";
  const action = isDark ? "Следующее действие: включить светлую тему." : "Следующее действие: включить тёмную тему.";
  return <main className={isDark ? "theme-panel is-dark" : "theme-panel"}>
    <h1>Настройки оформления</h1><p>{status}</p>
    {/* Имя toggle-кнопки постоянно; aria-pressed сообщает состояние.
        Отдельная подсказка описывает следующее действие. */}
    <button type="button" aria-pressed={isDark} aria-describedby="theme-action"
      onClick={() => setIsDark((current) => !current)}>Тёмная тема</button>
    <p id="theme-action">{action}</p>
  </main>;
}
