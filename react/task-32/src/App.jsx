import { useState } from "react";

export default function PasswordVisibility() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <main>
      <h1>Проверка введённого пароля</h1>
      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        // Меняется prop одного input; другой key ему не задаём.
        // Переключение видимости не сбрасывает введённое значение.
        type={isVisible ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button
        type="button"
        aria-controls="password"
        // Функционально инвертируем актуальный флаг.
        onClick={() => setIsVisible((current) => !current)}
      >
        {/* Подпись сообщает следующее действие; aria-pressed не добавляем. */}
        {isVisible ? "Скрыть пароль" : "Показать пароль"}
      </button>
      {/* Значение password используется только как value поля. */}
    </main>
  );
}
