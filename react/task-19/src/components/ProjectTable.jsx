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
