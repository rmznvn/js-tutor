import { useState } from "react";

// Те же правила, что и в Javascript/task-5; функция не зависит от React.
function getPasswordChecks(password) {
  let hasDigit = false;
  for (const character of password) {
    if ("0123456789".includes(character)) {
      hasDigit = true;
      break; // После первой цифры условие выполнено.
    }
  }
  return {
    hasMinLength: password.length >= 8,
    hasDigit,
    hasNoSpaces: !password.includes(" "), // Проверяем именно обычный пробел.
  };
}
export default function PasswordChecklist() {
  const [password, setPassword] = useState("");
  // Храним только ввод; результаты всегда вычисляем из актуального пароля.
  const checks = getPasswordChecks(password);
  return (
    <section>
      <h1>Создать пароль</h1>
      <label htmlFor="password">Пароль</label>
      {/* onChange обновляет состояние; trim не применяем, чтобы не скрыть пробелы. */}
      <input id="password" type="password" autoComplete="new-password"
        aria-describedby="password-checks" value={password}
        onChange={(event) => setPassword(event.target.value)} />
      <ul id="password-checks">
        <li>{checks.hasMinLength ? "✓" : "✗"} Не менее 8 символов</li>
        <li>{checks.hasDigit ? "✓" : "✗"} Есть цифра</li>
        <li>{checks.hasNoSpaces ? "✓" : "✗"} Нет обычных пробелов</li>
      </ul>
    </section>
  );
}
