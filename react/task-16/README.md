# Фильтрация и склонение счётчика — React

Выпуск **2026-10-16**. Время: **35–45 минут на обе версии**.

## Условие

Каталог объектов фильтруется по статусу; счётчик говорит «1 объект», «2 объекта», «5 объектов».

### Входные данные и критерии готовности

- Все / published / draft. Объекты: ЖК, Бизнес-центр, Завод, Склад, Школа.
- Сначала проверить последние две цифры 11–14, затем последнюю: 1 / 2–4 / остальные.
- Счётчик из отфильтрованного массива; при нуле пустое состояние.
- Общая чистая функция склонения; исходные данные не мутируются.
- Контракт склонения: неотрицательное целое количество из .length.

### Крайние случаи

- 0, 1, 2, 4, 5.
- 11, 14, 21, 22, 25.
- 111, 112; пустой каталог.

## Как рассуждать

1. **Интервьюер:** «Почему недостаточно последней цифры?»
2. **Интервьюер:** «Что хранить?»
3. **Интервьюер:** «Как получить число?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «11 заканчивается на 1, но требует объектов. Сначала проверю count % 100 в диапазоне 11–14.»

> «Только выбранный статус. Список, count и слово вычисляются.»

> «После filter возьму length. В JS вручную render, в React setter и JSX; проверю 11 и 21 отдельно.»

## Пошаговый разбор

1. Реализовать getObjectWord.
2. Реализовать filterProjects.
3. Обработать select.
4. Вывести count и слово.
5. Показать карточки и пустое состояние.

## Типичные ошибки

- Последняя цифра проверяется раньше 11–14.
- Отдельный state счётчика.
- Округлять дробь и называть это корректным склонением дробных чисел.

## Альтернативный способ

Intl.PluralRules('ru-RU') выбирает грамматическую категорию; нужно сопоставить её словам. Удобно для локализации, ручной алгоритм яснее объясняет правило.

## Ручная проверка

Прогони весь набор 0,1,2,4,5,11,14,21,22,25,111,112; проверь 3 опубликованных и 2 черновика.

Вторая реализация: [JavaScript](../../Javascript/task-15/README.md).

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

### src/components/ProjectFilter.jsx

```jsx
import { useState } from "react";
const projects = [
  { id: 1, title: "Жилой комплекс", status: "published" },
  { id: 2, title: "Бизнес-центр", status: "draft" },
  { id: 3, title: "Завод", status: "published" },
  { id: 4, title: "Складской комплекс", status: "draft" },
  { id: 5, title: "Школа", status: "published" },
];
// Контракт функции: неотрицательное целое count, например array.length.
// Для дробных количеств правила склонения другие.
function getObjectWord(count) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "объектов";
  const last = count % 10;
  if (last === 1) return "объект";
  if (last >= 2 && last <= 4) return "объекта";
  return "объектов";
}
function filterProjects(items, status) {
  return status === "all" ? [...items] : items.filter((item) => item.status === status);
}
function ProjectList({ items }) {
  if (items.length === 0) return <p>Ничего не найдено</p>;
  return <ul>{items.map((project) => <li key={project.id}>
    {project.title}{project.status === "published" ? " — опубликован" : " — черновик"}
  </li>)}</ul>;
}
export default function ProjectFilter() {
  const [status, setStatus] = useState("all");
  // Единственный state — фильтр; список и счётчик производны.
  const visible = filterProjects(projects, status);
  return <main><h1>Объекты</h1>
    <label htmlFor="filter">Статус</label>
    <select id="filter" value={status} onChange={(event) => setStatus(event.target.value)}>
      <option value="all">Все</option><option value="published">Опубликованные</option>
      <option value="draft">Черновики</option>
    </select>
    <p aria-live="polite">{visible.length} {getObjectWord(visible.length)}</p>
    <ProjectList items={visible} />
  </main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
