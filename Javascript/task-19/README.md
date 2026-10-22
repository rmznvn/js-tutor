# Переключатель темы — JavaScript

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

Вторая реализация: [React](../../react/task-20/README.md).

## Уточнение доступности

У toggle-кнопки с aria-pressed оставлена постоянная подпись «Тёмная тема». Следующее действие вынесено в связанную подсказку. Это уточнение к исходному условию о меняющемся названии; состояние, тексты и цвета по-прежнему выводятся из одного boolean.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const panel = document.getElementById("theme-panel");
const statusElement = document.getElementById("status");
const button = document.getElementById("toggle");
const action = document.getElementById("action");
let isDark = false;
function render() {
  panel.classList.toggle("is-dark", isDark); // Второй аргумент задаёт наличие класса.
  statusElement.textContent = isDark ? "Сейчас включена тёмная тема." : "Сейчас включена светлая тема.";
  action.textContent = isDark ? "Следующее действие: включить светлую тему." : "Следующее действие: включить тёмную тему.";
  // У toggle-кнопки сохраняем имя «Тёмная тема», меняется aria-pressed.
  button.setAttribute("aria-pressed", String(isDark));
}
button.addEventListener("click", () => { isDark = !isDark; render(); });
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}.theme-panel{padding:2rem;color:#1c1f2c;background:#fff;border:1px solid #d8dde3}.theme-panel.is-dark{color:#fff;background:#10131f;border-color:#545969}</style></head>
<body><main><section id="theme-panel" class="theme-panel"><h1>Настройки оформления</h1><p id="status"></p><button id="toggle" type="button" aria-pressed="false" aria-describedby="action">Тёмная тема</button><p id="action"></p></section></main><script src="./script.js"></script></body>
</html>

```

</details>
