# Форма заявки с проверками — React

Материал из выпуска **2026-10-02**. Время: **25–35 минут**.

## Условие

Пользователь вводит имя и подтверждает согласие перед заявкой на демо.

### Критерии готовности

- Управляемые input и checkbox; начальные значения пустая строка и false.
- Имя после trim содержит минимум 2 символа, согласие обязательно.
- Ошибки появляются при submit; редактирование очищает ошибку конкретного поля.
- Следующая отправка снова проверяет поля.
- Успех: «Анна, заявка принята.»; любое редактирование убирает его.
- Без перезагрузки и реального запроса на сервер.

### Ожидаемое поведение

| Имя | Согласие | Результат |
|---|---|---|
| только пробелы | true | Ошибка имени |
| ` Анна ` | true | Анна, заявка принята. |
| Анна | false | Ошибка согласия |

### Крайние случаи

- Одни пробелы не проходят.
- Внешние пробелы убираются в сообщении.
- Корректное имя без согласия не даёт успеха.

## Как рассуждать

1. **Интервьюер:** «Какие данные действительно нужны в состоянии?»

2. **Интервьюер:** «Что читать у checkbox?»

3. **Интервьюер:** «Можно ли читать errors сразу после setErrors?»

Определи вход, результат и ограничения. Разбей действие на преобразование данных и отображение. Перед написанием кода предскажи результат на маленьком примере.

## Как отвечать на собеседовании

> «Храню введённые данные, ошибки последней проверки и результат отправки. Проверку выношу в отдельную функцию.»

> «У checkbox читаю event.target.checked: это boolean, а value не отражает включение.»

> «Для решения использую локальный nextErrors: переменная errors в текущем обработчике относится к прежнему рендеру.»

## Пошаговый разбор

1. Создать состояния имени, согласия, ошибок, успеха.
2. Привязать value/checked и обработчики изменений.
3. В submit вызвать preventDefault.
4. Вычислить nextErrors через validateForm.
5. Сохранить ошибки; при отсутствии ключей показать успех.
6. При редактировании очистить ошибку поля и успех.

## Типичные ошибки

- name.length без trim принимает одни пробелы.
- setErrors не заменяет локальную переменную текущего рендера.
- Исчезновение ошибки при вводе не означает валидность: повторная проверка при submit.

## Альтернативный способ

HTML-валидация required требует меньше кода, но пользовательские сообщения и нормализация легче контролируются своей функцией. noValidate позволяет нашему обработчику управлять проверкой.

## Проверка

Сопоставь результаты с таблицей выше и проверь каждый крайний случай. Для неизменяемых обновлений дополнительно проверь сохранение исходных данных и отсутствие влияния на соседние элементы.

## Запуск

В терминале перейди в эту папку, затем выполни:

```bash
npm ci
npm run dev
```

Сборка: `npm run build`. Зависимости и lockfile взяты из существующего `react/task-1`. Компонент решения подключён через `src/App.jsx`.

## Полное решение с комментариями

Рабочий файл: [src/components/DemoForm.jsx](src/components/DemoForm.jsx). Код помещён в конце, чтобы можно было сначала решить задачу самостоятельно.

<details>
<summary>Показать полный код</summary>

```jsx
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
```

</details>
