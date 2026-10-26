# Фильтры с кнопкой «Применить» — React

Выпуск **2026-10-26**. Время: 35–45 минут.

## Условие

Редактор меняет запрос и checkbox, но карточки обновляются только после подтверждения фильтров.

### Входные данные и критерии готовности

- Четыре статьи: React: состояние (published), Webflow CMS (draft), React: формы (draft), Доступность интерфейсов (published).
- Форма: query и publishedOnly; изначально пустой запрос и false.
- Ввод и checkbox меняют только draft. Применить/Enter фиксируют applied без перезагрузки.
- Показывать «Есть неприменённые изменения», если draft отличается от applied; кнопка Применить disabled при равенстве.
- Сбросить немедленно очищает и draft, и applied; выдача снова полная.
- Выдача и счётчик производны от applied; исходные статьи неизменяемые.

### Крайние случаи

- Ввести React — пока видны все 4.
- Применить React, затем изменить checkbox без применения.
- Сбросить при неприменённом вводе; запрос без совпадений.

## Как рассуждать

- Почему здесь нужны два объекта фильтров?
- К какому объекту привязать input и выдачу?
- Где хранить hasChanges и счётчик?

Перед кодом определи вход, результат одного действия и ограничения. Отдели хранимые значения от производных; предскажи поведение на маленьком примере.

## Примеры ответов вслух

> «draft и applied представляют разные моменты: текущий ввод и последнее подтверждение. Различие между ними намеренное, это не лишнее дублирование.»

> «Input и checked связаны с draft; filterArticles читает только applied. Поэтому ввод не изменяет список до submit.»

> «Сравню два поля объектов для hasChanges; count возьму из visibleArticles.length. Эти значения вычисляются при рендере. Проверю ввод без применения и немедленный сброс.»

## Пошаговый разбор

1. Создать draft и applied.
2. Связать поля только с draft.
3. Фильтровать по applied.
4. Вычислить различие полей.
5. В onSubmit скопировать draft в applied.
6. Сбросить оба объекта сразу.
7. Показать пустую выдачу и производный счётчик.

## Типичные ошибки

- Фильтровать по draft — тогда кнопка не управляет выдачей.
- Сравнивать объекты через !==: это сравнение ссылок, не полей.
- Сбросить только форму, оставив старую выдачу.
- Мутировать draft — можно испортить подтверждённый снимок.

## Альтернативный способ

Отдельный useState для каждого поля и для каждого применённого значения делает простые setters очевиднее, но увеличивает повторение. Два объекта удобнее сбрасывать и применять целиком.

## Ручная проверка

Введи React: 4 карточки; примени: 2; включи checkbox: всё ещё 2; примени: 1. Сброс: 4. Проверь Enter, пустую выдачу и сброс при неприменённых изменениях.

## Запуск

Из папки задачи: `npm ci`, затем `npm run dev`. В Codespaces: `npm run dev -- --host 0.0.0.0`, затем Open in Browser. Сборка: `npm run build`.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### src/components/AppliedFilters.jsx

```jsx
import { useState } from "react";

const articles = [
  { id: 1, title: "React: состояние", published: true },
  { id: 2, title: "Webflow CMS", published: false },
  { id: 3, title: "React: формы", published: false },
  { id: 4, title: "Доступность интерфейсов", published: true },
];
const initialFilters = { query: "", publishedOnly: false };

function filterArticles(items, filters) {
  // Нормализация запроса не меняет текст в input.
  const query = filters.query.trim().toLowerCase();
  return items.filter((article) =>
    article.title.toLowerCase().includes(query) &&
    (!filters.publishedOnly || article.published)
  );
}

export default function AppliedFilters() {
  // draft — редактируемая форма; applied — последний подтверждённый выбор.
  // Они могут различаться намеренно, поэтому нужны оба состояния.
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState(initialFilters);

  // Результаты зависят только от applied: ввод не фильтрует список сам.
  const visibleArticles = filterArticles(articles, applied);
  const hasChanges =
    draft.query !== applied.query ||
    draft.publishedOnly !== applied.publishedOnly;

  function applyFilters(event) {
    event.preventDefault(); // Enter также применяет форму без перезагрузки.
    setApplied({ ...draft }); // Фиксируем текущий черновик.
  }

  function resetFilters() {
    // Сброс действует сразу и на форму, и на подтверждённую выдачу.
    setDraft({ ...initialFilters });
    setApplied({ ...initialFilters });
  }

  return (
    <main>
      <h1>Статьи</h1>
      <form onSubmit={applyFilters}>
        <label htmlFor="query">Поиск по названию</label>
        <input id="query" value={draft.query} onChange={(event) => {
          const query = event.target.value;
          setDraft((current) => ({ ...current, query }));
        }} />
        <label>
          <input type="checkbox" checked={draft.publishedOnly} onChange={(event) => {
            const publishedOnly = event.target.checked;
            setDraft((current) => ({ ...current, publishedOnly }));
          }} />
          Только опубликованные
        </label>
        <button type="submit" disabled={!hasChanges}>Применить</button>
        <button type="button" onClick={resetFilters}>Сбросить</button>
        {hasChanges && <p role="status">Есть неприменённые изменения.</p>}
      </form>

      {/* Счётчик выводится из той же коллекции, что и карточки. */}
      <p>Найдено: {visibleArticles.length}</p>
      {visibleArticles.length === 0 ? <p>Ничего не найдено</p> : (
        <ul>{visibleArticles.map((article) => (
          <li key={article.id}>
            {article.title} — {article.published ? "опубликовано" : "черновик"}
          </li>
        ))}</ul>
      )}
    </main>
  );
}

```

</details>
