# Читать дальше — JavaScript

Выпуск **2026-10-09**. Время: **25–35 минут**.

## Условие

Анонс длиннее 100 символов сокращается; кнопка раскрывает полный текст и сворачивает его обратно.

### Входные данные и критерии готовности

- Показывать первые 100 символов и … только при превышении лимита.
- Названия кнопки: «Читать дальше» / «Свернуть».
- Для короткого и пустого текста кнопки нет.
- Исходный текст не портится после повторных переключений.
- React получает text и limit через props; хранит только expanded. Текст в примере постоянен.
- Длина считается через .length, без emoji; обрезать слово допустимо.

### Крайние случаи

- Пустая строка.
- Ровно 100 символов.
- 101 символ.

## Как рассуждать

1. **Интервьюер:** «Когда сохранить полный текст?»
2. **Интервьюер:** «Что хранить, что вычислять?»
3. **Интервьюер:** «Кто обновляет интерфейс?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «В DOM сохраню textContent до первого сокращения, иначе полный текст будет потерян.»

> «Храню флаг expanded; видимый текст вычислю из исходного текста и лимита.»

> «В JS после переключения вызываю render. В React setter приводит к новому рендеру; проверю раскрыть → свернуть → раскрыть.»

## Пошаговый разбор

1. Получить полный текст.
2. Проверить length > limit.
3. Создать флаг раскрытия.
4. Вычислить сокращённую или полную строку.
5. Обновить текст, кнопку и aria-expanded.

## Типичные ошибки

- Читать «полный текст» из уже сокращённого DOM.
- Добавлять многоточие короткой строке.

## Альтернативный способ

CSS line-clamp сокращает по строкам и учитывает ширину карточки, но не выполняет требование ровно 100 символов; для решения о показе кнопки по переполнению понадобятся измерения.

## Ручная проверка

Проверь длины 0/100/101 и несколько циклов раскрытия.

Вторая реализация: [React](../../react/task-10/README.md).

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const textElement = document.getElementById("article-text");
const button = document.getElementById("read-more");
const limit = 100;
// Сохраняем оригинал ДО сокращения: DOM далее содержит только представление.
const fullText = textElement.textContent;
const needsTruncation = fullText.length > limit;
let expanded = false;
function render() {
  // slice не меняет исходную строку; пустой и короткий текст не сокращаются.
  textElement.textContent = needsTruncation && !expanded
    ? fullText.slice(0, limit) + "…" : fullText;
  button.hidden = !needsTruncation;
  button.textContent = expanded ? "Свернуть" : "Читать дальше";
  button.setAttribute("aria-expanded", String(expanded));
}
button.addEventListener("click", () => {
  expanded = !expanded;
  render(); // Обычная переменная не обновляет DOM автоматически.
});
render();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><h1>Обновление сайта</h1><p id="article-text">Перед публикацией сайта важно проверить мобильную версию, работу ссылок и формы заявки. Такой список проверок помогает заметить ошибки до того, как страницу увидят посетители.</p><button id="read-more" type="button" hidden aria-controls="article-text" aria-expanded="false">Читать дальше</button></main><script src="./script.js"></script></body>
</html>

```

</details>
