# Переключатель темы — React

Выпуск **2026-10-21**. Время: **25–35 минут на обе версии**.

## Условие

Светлая и тёмная темы отдельного блока, без сохранения между перезагрузками.

### Входные данные и критерии готовности

- Изначально isDark=false.
- Класс, статус и цвета зависят от одного boolean.
- Кнопка описывает следующее действие; aria-pressed отражает тёмную тему.
- DOM явно обновляет classList/textContent/атрибут; React использует JSX без querySelector.
- В React функциональное переключение state.

### Крайние случаи

- Начальное false.
- Быстрые нажатия.
- Текст действия соответствует следующей теме.

## Как рассуждать

1. **Интервьюер:** «Что хранить?»
2. **Интервьюер:** «Почему aria-pressed?»
3. **Интервьюер:** «Чем отличается React?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Один isDark. Текст, класс и статус производны.»

> «Он сообщает, включён ли режим. Для доступности подпись переключателя оставлю стабильной, а следующее действие выведу отдельным текстом.»

> «В DOM вручную render; в React setter и JSX. Проверю false → true → false и цвета.»

## Пошаговый разбор

1. Создать boolean.
2. Вычислить класс и тексты.
3. Подключить переключение.
4. DOM render или React JSX.
5. Применить CSS.

## Типичные ошибки

- Хранить boolean и отдельные тексты.
- Строка 'false' truthy.
- Менять только класс, забывая атрибут.

## Альтернативный способ

Checkbox с постоянной подписью «Тёмная тема» даёт нативный checked. Кнопка aria-pressed подходит для переключаемого режима; её доступное имя лучше сохранять постоянным.

## Ручная проверка

Светлая при старте, затем тёмная и обратно; проверь aria-pressed, цвета и подсказку действия.

Вторая реализация: [JavaScript](../../Javascript/task-19/README.md).

## Уточнение доступности

У toggle-кнопки с aria-pressed оставлена постоянная подпись «Тёмная тема». Следующее действие вынесено в связанную подсказку. Это уточнение к исходному условию о меняющемся названии; состояние, тексты и цвета по-прежнему выводятся из одного boolean.

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

### src/components/ThemeSwitcher.jsx

```jsx
import { useState } from "react";
export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  // Класс и тексты выводятся из одного boolean, не требуют отдельных setters.
  const status = isDark ? "Сейчас включена тёмная тема." : "Сейчас включена светлая тема.";
  const action = isDark ? "Следующее действие: включить светлую тему." : "Следующее действие: включить тёмную тему.";
  return <main className={isDark ? "theme-panel is-dark" : "theme-panel"}>
    <h1>Настройки оформления</h1><p>{status}</p>
    {/* Имя toggle-кнопки постоянно; aria-pressed сообщает состояние.
        Отдельная подсказка описывает следующее действие. */}
    <button type="button" aria-pressed={isDark} aria-describedby="theme-action"
      onClick={() => setIsDark((current) => !current)}>Тёмная тема</button>
    <p id="theme-action">{action}</p>
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}
.theme-panel{padding:2rem;color:#1c1f2c;background:#fff;border:1px solid #d8dde3}.theme-panel.is-dark{color:#fff;background:#10131f;border-color:#545969}

```

</details>
