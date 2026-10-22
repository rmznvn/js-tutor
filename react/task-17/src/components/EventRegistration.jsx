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
