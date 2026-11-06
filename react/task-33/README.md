# React: ошибки формы после blur
Выпуск: 6 ноября 2026.

## Условие
Форма локально проверяет заявку: имя — минимум 2 символа после trim, название проекта — минимум 3.
Начальные values пустые, touched обоих полей false, подтверждения нет.
До первого ухода из поля ошибок нет. После blur ошибка этого поля видна и обновляется при вводе. Submit раскрывает ошибки всех полей, включая непосещённые. Успех показывает честное локальное подтверждение, без отправки. Любое редактирование скрывает прежнее подтверждение.
Готово: хранить values/touched/флаг успеха; errors вычислять чистой функцией; кнопка доступна для запроса проверок; поля controlled, ошибки связаны через aria-describedby.
Крайние случаи: submit сразу после открытия; пробельные строки; исправление после ошибки или после успеха.
Время: 25–35 минут.

## Как рассуждать
1. Отличается ли наличие ошибки от решения показать её?
2. Где хранить ошибки, если они полностью зависят от values?
3. Можно ли после setTouched сразу читать обновлённый touched?

blur — событие потери фокуса. touched — обычный объект приложения, не специальная возможность React.

## Примеры ответов вслух
«Пустое имя невалидно с самого начала, но сообщение пока не показываю. Разделю правило проверки и момент показа: validate вычисляет ошибки, touched управляет их видимостью».
«Храню введённые строки и touched. Ошибки вычисляю при рендере; отдельный state ошибок пришлось бы синхронизировать после каждого ввода».
«В submit отмечу оба поля, но проверю уже вычисленные полные errors, независимо от touched. Setter не меняет переменные текущего вызова».
«После первого blur touched останется true, поэтому ошибка будет исчезать сразу при исправлении. Проверю untouched-поле через submit, пробелы, границы длины и очистку старого подтверждения».

## Пошаговый разбор
1. Напиши чистую validate(values), возвращающую сообщения для всех полей.
2. Создай values и touched с одинаковыми ключами.
3. В change обновляй значение и сбрасывай успех.
4. В blur отмечай только соответствующее поле.
5. Показывай сообщение при touched[field].
6. В submit пометь все поля и проверь все ошибки.
7. Выведи локальное подтверждение только при валидных данных.

Ошибки: проверять лишь touched-поля при submit; хранить дублирующее состояние errors; не trim пробелы; ждать синхронного изменения touched после setter; блокировать кнопку так, что пользователь не может запросить ошибки.
Проверки: начально пусто без ошибок → submit → обе ошибки; имя " А " не проходит → " Анна " проходит; проект " ab " не проходит → " abc " проходит; после успеха ввод скрывает подтверждение.
Альтернатива: флаг submitted без touched — показывать все ошибки только после первой попытки. Кода меньше, но индивидуальная обратная связь при уходе из поля отсутствует. Подходит коротким формам с проверкой по кнопке.

## Запуск
npm ci, npm run dev. Codespaces: npm run dev -- --host 0.0.0.0, затем открой порт.

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### src/App.jsx

```jsx
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
```

</details>
