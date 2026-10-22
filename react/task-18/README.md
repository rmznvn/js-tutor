# Показать ещё — React

Выпуск **2026-10-19**. Время: **35–45 минут на обе версии**.

## Условие

Список из 8 статей раскрывается порциями по 3 и сворачивается к первым трём.

### Входные данные и критерии готовности

- Показано N из M; slice для видимого массива.
- Хранить только visibleCount; ограничить Math.min длиной.
- Показать ещё пока есть скрытые.
- Свернуть доступно после раскрытия сверх первой порции, в том числе до конца списка.
- При нуле «Статей нет»; исходный массив не меняется.

### Крайние случаи

- 0 или 2 статьи.
- 8 статей, последняя порция неполная.
- Повторное раскрытие после сворачивания.

## Как рассуждать

1. **Интервьюер:** «Какое минимальное состояние?»
2. **Интервьюер:** «Зачем Math.min?»
3. **Интервьюер:** «Нужен ли массив в state?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Только число; видимые статьи получаю slice(0,count).»

> «Оно ограничивает количество длиной, поэтому будет 8 из 8, а не 9 из 8.»

> «Нет, он производный. В JS вызываю render, в React функционально обновляю count.»

## Пошаговый разбор

1. Установить min(3,length).
2. Вычислить slice.
3. Обновить список и счётчик.
4. На показ увеличить с ограничением.
5. На сворачивание вернуть начальное число.
6. Вычислить кнопки и пустоту.

## Типичные ошибки

- splice удаляет исходные данные.
- Два состояния для массива и количества.
- 3 из 0 при пустом массиве.

## Альтернативный способ

Добавлять только новые DOM-элементы экономнее для больших списков; полный render проще синхронизирует сворачивание и текущие данные.

## Ручная проверка

3 → 6 → 8 → 3; проверь массивы длиной 0 и 2.

Вторая реализация: [JavaScript](../../Javascript/task-17/README.md).

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

### src/components/LoadMoreArticles.jsx

```jsx
import { useState } from "react";
const ARTICLES_PER_PAGE = 3;
const articles = [
  {id:1,title:"Основы Webflow CMS"},{id:2,title:"Методы массивов"},
  {id:3,title:"Состояние в React"},{id:4,title:"Доступность форм"},
  {id:5,title:"Работа с localStorage"},{id:6,title:"Асинхронный JavaScript"},
  {id:7,title:"Оптимизация изображений"},{id:8,title:"Фильтрация карточек"},
];
function ArticleList({ items }) {
  return <ul>{items.map((article) => <li key={article.id}>{article.title}</li>)}</ul>;
}
export default function LoadMoreArticles() {
  const [visibleCount, setVisibleCount] = useState(Math.min(ARTICLES_PER_PAGE, articles.length));
  // Только число в state; массив каждый раз выводится из каталога.
  const visible = articles.slice(0, visibleCount);
  function showMore() {
    setVisibleCount((current) => Math.min(current + ARTICLES_PER_PAGE, articles.length));
  }
  return <main><h1>Статьи</h1>
    <p aria-live="polite">Показано {visible.length} из {articles.length}</p>
    {articles.length === 0 ? <p>Статей нет</p> : <ArticleList items={visible} />}
    {visibleCount < articles.length && <button type="button" onClick={showMore}>Показать ещё</button>}
    {visibleCount > ARTICLES_PER_PAGE && <button type="button"
      onClick={() => setVisibleCount(Math.min(ARTICLES_PER_PAGE, articles.length))}>Свернуть список</button>}
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
