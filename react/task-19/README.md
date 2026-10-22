# Сортируемая таблица проектов — React

Выпуск **2026-10-21**. Время: **40–50 минут**.

## Условие

Сортировка по названию, бюджету, статусу и переключение статуса строки.

### Входные данные и критерии готовности

- Старт name asc; повторный заголовок меняет asc/desc; новая колонка стартует asc.
- Индикатор ↑/↓ и aria-sort у активного th.
- sort только копии; строки localeCompare, числа вычитанием.
- sortConfig key/direction в state; sortedProjects производный.
- toggle status через map и spread; сортировка пересчитывается.
- Порядок статусов явно active перед paused при asc; ID развязывает равенство.

### Крайние случаи

- Равные бюджеты.
- Изменение статуса при сортировке по нему.
- Повтор колонки и смена колонки.

## Как рассуждать

1. **Интервьюер:** «Почему копия?»
2. **Интервьюер:** «Что хранить?»
3. **Интервьюер:** «Как сравнивать равные значения?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «sort мутирует массив; [...projects] защищает state. Объекты не копирую глубоко, потому что сравнение не меняет их.»

> «Данные и конфигурацию. Отсортированный список вычисляю.»

> «Основной результат умножаю на направление, при равенстве сравниваю ID для определённого порядка. Проверю равные бюджеты.»

## Пошаговый разбор

1. Создать состояния.
2. Копировать и сортировать по ключу.
3. Применить направление и ID.
4. Переключить конфигурацию заголовком.
5. Обновлять статус неизменяемо.
6. Вывести таблицу с key ID.

## Типичные ошибки

- projects.sort мутирует state.
- Отдельный state sortedProjects устаревает.
- Вычитание строк и индекс как key.

## Альтернативный способ

Сортировать и сохранять массив по клику можно, но после каждого изменения данных нужно повторять сортировку. Производное представление проще для небольшой таблицы.

## Ручная проверка

Название asc/desc; бюджет с двумя 95000; новая колонка asc; статус переключается и строка меняет позицию.

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

### src/components/ProjectTable.jsx

```jsx
import { useState } from "react";
const initialProjects = [
  {id:1,name:"Медиацентр",budget:120000,status:"active"},
  {id:2,name:"Лендинг конференции",budget:85000,status:"paused"},
  {id:3,name:"База знаний",budget:160000,status:"active"},
  {id:4,name:"Страница продукта",budget:95000,status:"paused"},
  {id:5,name:"Личный кабинет",budget:95000,status:"active"},
];
function sortProjects(projects, config) {
  // sort мутирует только новую копию массива, объекты сравнение не меняет.
  return [...projects].sort((a, b) => {
    let result;
    if (config.key === "budget") result = a.budget - b.budget;
    else if (config.key === "status") {
      // Явный порядок статусов active → paused при asc.
      const ranks = { active: 0, paused: 1 };
      result = ranks[a.status] - ranks[b.status];
    } else result = a.name.localeCompare(b.name, "ru");
    // При равенстве ID обеспечивает определённый порядок в каждом направлении.
    return (result || a.id - b.id) * (config.direction === "asc" ? 1 : -1);
  });
}
function SortHeader({ column, label, config, onSort }) {
  const active = column === config.key;
  return <th scope="col" aria-sort={active ? config.direction === "asc" ? "ascending" : "descending" : undefined}>
    <button type="button" onClick={() => onSort(column)}>
      {label}{active ? config.direction === "asc" ? " ↑" : " ↓" : ""}
    </button>
  </th>;
}
export default function ProjectTable() {
  const [projects, setProjects] = useState(initialProjects);
  const [config, setConfig] = useState({key:"name",direction:"asc"});
  const sorted = sortProjects(projects, config);
  function requestSort(key) {
    setConfig((current) => ({
      key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }
  function toggle(id) {
    setProjects((current) => current.map((project) => project.id !== id ? project :
      {...project, status: project.status === "active" ? "paused" : "active"}));
  }
  return <main><h1>Проекты</h1><table>
    <caption>Сортировка по названию, бюджету и статусу</caption>
    <thead><tr>
      <SortHeader column="name" label="Название" config={config} onSort={requestSort} />
      <SortHeader column="budget" label="Бюджет" config={config} onSort={requestSort} />
      <SortHeader column="status" label="Статус" config={config} onSort={requestSort} />
      <th scope="col">Действие</th>
    </tr></thead>
    <tbody>{sorted.map((project) => <tr key={project.id}>
      <td>{project.name}</td><td>{project.budget} ₽</td>
      <td>{project.status === "active" ? "Активен" : "На паузе"}</td>
      <td><button type="button" onClick={() => toggle(project.id)}>
        {project.status === "active" ? "Поставить на паузу" : "Возобновить"}
      </button></td>
    </tr>)}</tbody>
  </table></main>;
}

```

### src/index.css

```css
body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f7f9; color: #1c1f2c; } main { max-width: 800px; margin: auto; } button, input { font: inherit; margin: .4rem; } button { padding: .5rem .8rem; cursor: pointer; } button:disabled { cursor: default; } label { display: block; } li { margin-block: 1rem; } [hidden] { display: none !important; } [aria-selected="true"] { color: #9b6500; font-weight: bold; }

textarea, select {font:inherit;} table {border-collapse:collapse;width:100%} td,th {padding:.6rem;border:1px solid #bbb} dialog {max-width:32rem;border:1px solid #545969;border-radius:.5rem} dialog::backdrop {background:rgb(0 0 0 / .6)} article {margin:1rem 0} input, textarea {max-width:100%;box-sizing:border-box}

```

</details>
