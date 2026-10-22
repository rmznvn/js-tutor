# Выбор карточек и массовое удаление — React

Выпуск **2026-10-09**. Время: **30–40 минут**.

## Условие

Редактор выбирает черновики и удаляет выбранные одной кнопкой.

### Входные данные и критерии готовности

- Карточки: 1 — Обзор продукта, 2 — Новости команды, 3 — Инструкция по настройке.
- Checkbox карточки переключает её ID; общий checkbox выбирает все или снимает выбор.
- Показывать число выбранных; удалять только выбранные и очищать выбор.
- При пустом выборе удаление disabled; после удаления всех показывать «Черновиков нет».
- Частичный выбор означает выключенный общий checkbox; indeterminate не требуется.

### Крайние случаи

- Выбрана часть списка.
- Выбраны все.
- Удалены все: общий checkbox выключен и disabled.

## Как рассуждать

1. **Интервьюер:** «Что хранить для выбора?»
2. **Интервьюер:** «Нужен ли отдельный state для полного выбора?»
3. **Интервьюер:** «Как удалить без мутации?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Храню статьи и выбранные ID. Копии объектов выбора дублировали бы данные.»

> «Выбраны все, если список непустой и длины равны. Проверка непустоты исключает 0 === 0.»

> «filter оставит статьи, ID которых нет в выборе. Затем сброшу выбранные ID; проверю удаление части и всего списка.»

## Пошаговый разбор

1. Создать два состояния.
2. Вычислить selectedCount и allSelected.
3. Связать checked с includes.
4. Переключать ID функциональным setter.
5. В общем выборе использовать map ID или [].
6. Удалить через filter и очистить выбор.

## Типичные ошибки

- push мутирует массив state.
- Отдельные счётчик и boolean требуют синхронизации.
- Нельзя оставлять ID удалённых карточек в выборе.

## Альтернативный способ

Хранить selected внутри объектов. Выбор удаляется вместе с карточкой, но временное состояние интерфейса смешивается с данными; каждое переключение требует map.

## Ручная проверка

Выбери первую → 1; все → 3; сними вторую → 2; удали → останется вторая, выбор 0.

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

### src/components/DraftManager.jsx

```jsx
import { useState } from "react";
const initialArticles = [
  {id:1,title:"Обзор продукта"},{id:2,title:"Новости команды"},{id:3,title:"Инструкция по настройке"},
];
export default function DraftManager() {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedIds, setSelectedIds] = useState([]);
  // Пустой список не считается полностью выбранным: 0 === 0 недостаточно.
  const allSelected = articles.length > 0 && selectedIds.length === articles.length;
  function toggleArticle(id) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id) : [...current, id]);
  }
  function selectAll(event) {
    // Для checkbox читаем checked, а не строковое value.
    setSelectedIds(event.target.checked ? articles.map((item) => item.id) : []);
  }
  function deleteSelected() {
    if (selectedIds.length === 0) return;
    // Новый массив содержит только невыбранные карточки.
    setArticles((current) => current.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]); // Удалённых ID больше нет в выборе.
  }
  return <section>
    <h1>Черновики статей</h1>
    <label><input type="checkbox" checked={allSelected} disabled={articles.length === 0}
      onChange={selectAll} />Выбрать все</label>
    <p>Выбрано: {selectedIds.length}</p>
    <button type="button" disabled={selectedIds.length === 0} onClick={deleteSelected}>Удалить выбранные</button>
    {articles.length === 0 ? <p>Черновиков нет</p> : <ul>
      {articles.map((article) => <li key={article.id}>
        <label><input type="checkbox" checked={selectedIds.includes(article.id)}
          onChange={() => toggleArticle(article.id)} />{article.title}</label>
      </li>)}
    </ul>}
  </section>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
