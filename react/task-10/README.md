# Читать дальше — React

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

Вторая реализация: [JavaScript](../../Javascript/task-9/README.md).

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

### src/components/TextExpanderDemo.jsx

```jsx
import { useState } from "react";
function TextExpander({ text, limit = 100 }) {
  const [expanded, setExpanded] = useState(false);
  // Всё кроме флага выводится из props и state. Оригинальный текст не меняется.
  const needsTruncation = text.length > limit;
  const visibleText = needsTruncation && !expanded ? text.slice(0, limit) + "…" : text;
  return <div>
    <p>{visibleText}</p>
    {needsTruncation && <button type="button" aria-expanded={expanded}
      onClick={() => setExpanded((current) => !current)}>
      {expanded ? "Свернуть" : "Читать дальше"}
    </button>}
  </div>;
}
export default function TextExpanderDemo() {
  return <article>
    <h1>Обновление сайта</h1>
    {/* Постоянный текст: изменения props во время раскрытия в задачу не входят. */}
    <TextExpander text="Перед публикацией сайта важно проверить мобильную версию, работу ссылок и формы заявки. Такой список проверок помогает заметить ошибки до того, как страницу увидят посетители." />
  </article>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
