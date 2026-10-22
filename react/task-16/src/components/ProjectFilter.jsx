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
