import { useState } from "react";

function validate(values) {
  // Чистая функция всегда проверяет все поля.
  // Когда показывать ошибки, решает интерфейс через touched.
  return {
    name: values.name.trim().length < 2 ? "Имя: минимум 2 символа." : "",
    project: values.project.trim().length < 3 ? "Проект: минимум 3 символа." : "",
  };
}

export default function ProjectForm() {
  const [values, setValues] = useState({ name: "", project: "" });
  // touched означает: поле уже покинули или попытались проверить форму.
  const [touched, setTouched] = useState({ name: false, project: false });
  const [success, setSuccess] = useState(false);
  const errors = validate(values);

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSuccess(false); // Старое подтверждение больше не относится к вводу.
  }

  function blur(event) {
    const name = event.target.name;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function submit(event) {
    event.preventDefault();
    // Submit раскрывает ошибки также у полей, которых ещё не касались.
    setTouched({ name: true, project: true });
    // Не читаем touched сразу после setter: проверяем полные errors.
    const isValid = errors.name === "" && errors.project === "";
    setSuccess(isValid);
  }

  return (
    <main>
      <h1>Проверка заявки на проект</h1>
      {/* Используем собственные учебные правила, без встроенной валидации. */}
      <form noValidate onSubmit={submit}>
        <label htmlFor="name">Имя</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={change}
          onBlur={blur}
          aria-invalid={touched.name && Boolean(errors.name)}
          aria-describedby="name-error"
        />
        <p id="name-error" role="alert">
          {touched.name ? errors.name : ""}
        </p>

        <label htmlFor="project">Название проекта</label>
        <input
          id="project"
          name="project"
          value={values.project}
          onChange={change}
          onBlur={blur}
          aria-invalid={touched.project && Boolean(errors.project)}
          aria-describedby="project-error"
        />
        <p id="project-error" role="alert">
          {touched.project ? errors.project : ""}
        </p>

        {/* Кнопка доступна, чтобы пользователь мог запросить все ошибки. */}
        <button type="submit">Проверить заявку</button>
        <p role="status">
          {success ? "Проверено локально. Заявка не отправлялась." : ""}
        </p>
      </form>
    </main>
  );
}
