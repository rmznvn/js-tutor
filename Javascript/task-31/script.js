const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("toggle");
let isVisible = false; // Пароль изначально скрыт.

function render() {
  // Меняем тип существующего input, не создаём новый элемент.
  // Его value сохраняется: пароль не нужно копировать между полями.
  passwordInput.type = isVisible ? "text" : "password";
  toggleButton.textContent =
    isVisible ? "Скрыть пароль" : "Показать пароль";
}

toggleButton.addEventListener("click", () => {
  isVisible = !isVisible;
  render();
});

// Значение пароля не выводим в консоль, текст страницы или хранилище.
render();
