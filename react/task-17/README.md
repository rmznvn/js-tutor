# Многошаговая форма регистрации — React

Выпуск **2026-10-19**. Время: **45–60 минут**.

## Условие

Три шага: имя; email и билет; проверка данных. Учебная отправка без API.

### Входные данные и критерии готовности

- Имя после trim минимум 2; email с текстом до @ и точкой после него; билет online/offline.
- Показывать шаг 1 из 3; далее только при корректном шаге.
- Назад сохраняет данные; сводка производная.
- Объект formData обновляется spread и [name].
- Отправка повторно проверяет ВСЕ поля; новая регистрация сбрасывает состояния.
- Сообщение явно говорит о демонстрации, фактического письма нет.

### Крайние случаи

- Пробельное имя.
- test@site и @site.ru.
- Назад, исправление, повторная регистрация.

## Как рассуждать

1. **Интервьюер:** «Почему объект формы?»
2. **Интервьюер:** «Нужна ли сводка в state?»
3. **Интервьюер:** «Что проверять при submit?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Поля одной сущности обновляю общим обработчиком: spread сохраняет остальные свойства, [name] меняет одно.»

> «Сводку строю из актуальных полей; state создал бы лишнюю синхронизацию.»

> «Не только индекс сводки: повторно валидирую все поля. Проверю возврат назад и некорректные email.»

## Пошаговый разбор

1. Создать formData, step, submitted.
2. Написать проверки полей и шага.
3. Связать controlled inputs.
4. Защитить переходы границами.
5. Вывести сводку.
6. При submit проверить все поля.
7. Сбросить начальные значения для новой регистрации.

## Типичные ошибки

- setFormData({name}) теряет другие поля.
- Проверять только шаг 3, где нет полей.
- Писать «письмо отправлено» без API.

## Альтернативный способ

Отдельный useState для каждого поля проще для двух inputs; объект удобнее для общей обработки и сброса нескольких полей.

## Ручная проверка

Пустое имя блокирует шаг; невалидный email блокирует второй; назад сохраняет; отправка и сброс работают.

## Уточнение к решению из чата

Финальная отправка повторно валидирует все поля; на шаге сводки проверка не становится автоматически успешной. Сообщение подтверждает только учебную обработку: запрос на сервер и письмо отсутствуют. Обработчик «Далее» вызывает preventDefault: после переключения шага React может использовать тот же DOM-узел для submit-кнопки, поэтому переход к сводке не должен запускать отправку. Проверка email намеренно упрощённая, не полный стандарт адресов.

## Запуск

В терминале из этой папки:

```sh
npm ci
npm run dev
```

Сборка: `npm run build`. Это самостоятельный Vite-проект; корень репозитория не содержит общего npm-приложения.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### src/components/EventRegistration.jsx

```jsx
import { useState } from "react";
const LAST_STEP = 2;
const initialData = { name: "", email: "", ticket: "" };
function validateAll(data) {
  const email = data.email.trim();
  const at = email.indexOf("@");
  const dot = email.indexOf(".", at + 1);
  // Упрощённая проверка из задания, дополнительно исключены пробелы и второй @.
  const validEmail = at > 0 && at === email.lastIndexOf("@") &&
    dot > at + 1 && dot < email.length - 1 && !/\s/.test(email);
  return {
    name: data.name.trim().length < 2 ? "Введите имя минимум из двух символов." : "",
    email: validEmail ? "" : "Введите корректный email.",
    ticket: ["online", "offline"].includes(data.ticket) ? "" : "Выберите тип билета.",
  };
}
function SummaryStep({ data }) {
  return <section><h2>Проверьте данные</h2><dl>
    <dt>Имя</dt><dd>{data.name.trim()}</dd>
    <dt>Email</dt><dd>{data.email.trim()}</dd>
    <dt>Билет</dt><dd>{data.ticket === "online" ? "Онлайн" : "Очно"}</dd>
  </dl></section>;
}
export default function EventRegistration() {
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateAll(data);
  const currentError = step === 0 ? errors.name : step === 1
    ? errors.email || errors.ticket : errors.name || errors.email || errors.ticket;
  function change(event) {
    const { name, value } = event.target;
    // Сохраняем остальные свойства и обновляем одно поле по name.
    setData((current) => ({...current, [name]: value}));
  }
  function next(event) {
    // Отменяем default: после рендера эта же кнопка может стать submit.
    // Переход к сводке не должен незаметно отправить форму.
    event.preventDefault();
    if (currentError) return;
    setStep((current) => Math.min(current + 1, LAST_STEP));
  }
  function submit(event) {
    event.preventDefault();
    // На сводке тоже проверяем ВСЕ поля, а не только отсутствие новых inputs.
    const finalErrors = validateAll(data);
    if (step !== LAST_STEP || Object.values(finalErrors).some(Boolean)) return;
    setSubmitted(true);
  }
  function reset() { setData(initialData); setStep(0); setSubmitted(false); }
  if (submitted) return <main><h1>Учебная регистрация завершена</h1>
    <p>{data.name.trim()}, данные проверены. Письмо на {data.email.trim()} не отправлялось: API не подключён.</p>
    <button type="button" onClick={reset}>Новая регистрация</button>
  </main>;
  return <main><h1>Регистрация на мероприятие</h1><p>Шаг {step + 1} из 3</p>
    <form onSubmit={submit} noValidate>
      {step === 0 && <section><h2>Личные данные</h2>
        <label htmlFor="name">Имя</label>
        <input id="name" name="name" autoComplete="given-name" value={data.name} onChange={change}
          aria-invalid={Boolean(errors.name)} aria-describedby="registration-error" />
      </section>}
      {step === 1 && <section><h2>Контакты и билет</h2>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" value={data.email}
          onChange={change} aria-invalid={Boolean(errors.email)} aria-describedby="registration-error" />
        <label htmlFor="ticket">Тип билета</label>
        <select id="ticket" name="ticket" value={data.ticket} onChange={change}
          aria-invalid={Boolean(errors.ticket)} aria-describedby="registration-error">
          <option value="">Выберите билет</option><option value="online">Онлайн</option><option value="offline">Очно</option>
        </select>
      </section>}
      {step === 2 && <SummaryStep data={data} />}
      <p id="registration-error" role="alert">{currentError}</p>
      {step > 0 && <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))}>Назад</button>}
      {step < LAST_STEP ? <button type="button" disabled={Boolean(currentError)} onClick={next}>Далее</button> :
        <button type="submit" disabled={Boolean(currentError)}>Отправить регистрацию</button>}
    </form>
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
