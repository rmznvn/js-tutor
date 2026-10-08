// Правила не зависят от DOM: функция получает строку и возвращает boolean.
function getPasswordChecks(password) {
  let hasDigit = false;
  for (const character of password) {
    // Ищем именно ASCII-цифры; Number(" ") здесь применять нельзя.
    if ("0123456789".includes(character)) {
      hasDigit = true;
      break; // Одной цифры достаточно.
    }
  }
  return {
    hasMinLength: password.length >= 8,
    hasDigit,
    // Проверяем обычный пробел; trim скрывал бы нарушение на краях.
    hasNoSpaces: !password.includes(" "),
  };
}

// Альтернатива использует регулярное выражение.
// [0-9] обозначает одну цифру, test возвращает boolean.
function getPasswordChecksWithRegex(password) {
  return {
    hasMinLength: password.length >= 8,
    hasDigit: /[0-9]/.test(password),
    hasNoSpaces: !password.includes(" "),
  };
}
const input = document.getElementById("password");
const lengthCheck = document.getElementById("length-check");
const digitCheck = document.getElementById("digit-check");
const spacesCheck = document.getElementById("spaces-check");

function renderChecks() {
  const checks = getPasswordChecks(input.value);
  // textContent выводит текст, а не интерпретирует его как HTML.
  lengthCheck.textContent = (checks.hasMinLength ? "✓" : "✗") + " Не менее 8 символов";
  digitCheck.textContent = (checks.hasDigit ? "✓" : "✗") + " Есть цифра";
  spacesCheck.textContent = (checks.hasNoSpaces ? "✓" : "✗") + " Нет обычных пробелов";
}
input.addEventListener("input", renderChecks);
renderChecks(); // Пустое поле: ✗, ✗, ✓.
