import { useState } from "react";

const initialTasks = [
  { id: 1, title: "Проверить мобильную версию", done: false },
  { id: 2, title: "Проверить ссылки", done: true },
  { id: 3, title: "Проверить форму заявки", done: false },
];
// Ребёнок получает данные и callbacks, не изменяет props.
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li>
      <label>
        {/* checked управляется полем done, callback сообщает родителю ID. */}
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        {task.title}
      </label>
      <button type="button" onClick={() => onDelete(task.id)}>Удалить</button>
    </li>
  );
}
export default function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  // Производное значение: не требуется синхронизация отдельного счётчика.
  const completedCount = tasks.filter((task) => task.done).length;
  function toggleTask(id) {
    setTasks((currentTasks) => currentTasks.map((task) => {
      if (task.id !== id) return task;
      // Новый массив и копия изменяемого объекта обеспечивают неизменяемость.
      return { ...task, done: !task.done };
    }));
  }
  function deleteTask(id) {
    // filter исключает выбранный ID и сохраняет остальные задачи.
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }
  return (
    <section>
      <h1>Проверки перед публикацией</h1>
      <p>Выполнено: {completedCount} из {tasks.length}</p>
      {tasks.length === 0 ? <p>Список пуст</p> : (
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </section>
  );
}
