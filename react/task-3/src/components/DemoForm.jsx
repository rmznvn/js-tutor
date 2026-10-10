import { useState } from "react";

// Проверка данных не зависит от интерфейса.
function validateForm(name, agreed) {
  const errors = {};
  // trim исключает пробелы с краёв; строка из пробелов не является именем.
  if (name.trim().length < 2) errors.name = "Введите имя: минимум 2 символа.";
  if (!agreed) errors.agreed = "Подтвердите согласие.";
  return errors;
}
export default function DemoForm() {
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  function handleNameChange(event) {
    setName(event.target.value);
    // Убираем только ошибку редактируемого поля и прежний успех.
    setErrors((current) => ({ ...current, name: "" }));
    setSuccessMessage("");
  }
  function handleAgreementChange(event) {
    // Для checkbox читаем boolean checked, а не строку value.
    setAgreed(event.target.checked);
    setErrors((current) => ({ ...current, agreed: "" }));
    setSuccessMessage("");
  }
  function handleSubmit(event) {
    event.preventDefault(); // Предотвращаем навигацию/перезагрузку формы.
    const nextErrors = validateForm(name, agreed);
    setErrors(nextErrors);
    setSuccessMessage("");
    // Читаем локальный результат проверки: errors ещё относится к текущему рендеру.
    if (Object.keys(nextErrors).length === 0) {
      setSuccessMessage(`${name.trim()}, заявка принята.`);
    }
  }
  return (
    // noValidate оставляет проверку нашему обработчику, а не браузеру.
    <form onSubmit={handleSubmit} noValidate>
      <h1>Заявка на демо</h1>
      <label htmlFor="demo-name">Имя</label>
      <input id="demo-name" name="name" type="text" autoComplete="given-name"
        value={name} onChange={handleNameChange}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? "name-error" : undefined} />
      {errors.name && <p id="name-error" role="alert">{errors.name}</p>}
      <label>
        <input name="agreement" type="checkbox" checked={agreed}
          onChange={handleAgreementChange} aria-invalid={Boolean(errors.agreed)}
          aria-describedby={errors.agreed ? "agreement-error" : undefined} />
        Согласен на обработку персональных данных
      </label>
      {errors.agreed && <p id="agreement-error" role="alert">{errors.agreed}</p>}
      <button type="submit">Отправить заявку</button>
      <p role="status">{successMessage}</p>
    </form>
  );
}
