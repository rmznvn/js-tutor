import { useState } from "react";

const initialProfile = { name: "Наталья", role: "Webflow developer" };

export default function ProfileEditor() {
  // Сохранённые данные и редактируемый черновик имеют разный смысл.
  const [saved, setSaved] = useState(initialProfile);
  const [draft, setDraft] = useState({ ...initialProfile });
  const [message, setMessage] = useState("");
  // Сравниваем содержимое полей, а не ссылки объектов: это производное значение.
  const dirty = draft.name !== saved.name || draft.role !== saved.role;
  // trim нужен для проверки имени из одних пробелов.
  const error = draft.name.trim() ? "" : "Введите имя";

  function update(field, value) {
    // Копия сохраняет другое поле. Функциональное обновление берёт актуальный draft.
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage("");
  }
  function save(event) {
    event.preventDefault(); // Обрабатываем submit без перезагрузки страницы.
    if (error || !dirty) return; // Повторяем проверку внутри обработчика.
    const next = { name: draft.name.trim(), role: draft.role.trim() };
    setSaved(next); // Фиксируем подтверждённые значения.
    setDraft({ ...next }); // Убираем отличия, вызванные нормализацией пробелов.
    setMessage("Сохранено в памяти страницы"); // Здесь нет запроса к серверу.
  }
  function cancel() {
    setDraft({ ...saved }); // Возвращаем именно последнее сохранение, не initialProfile.
    setMessage("Изменения отменены");
  }
  return (
    <main>
      <h1>Редактор профиля</h1>
      <p>Сохранено: {saved.name} — {saved.role || "Роль не указана"}</p>
      <form onSubmit={save} noValidate>
        <label htmlFor="name">Имя</label>
        {/* Управляемое поле отображает draft; saved меняется только по submit. */}
        <input id="name" value={draft.name} onChange={(e) => update("name", e.target.value)} aria-invalid={Boolean(error)} aria-describedby="name-error" />
        <p id="name-error">{error}</p>
        <label htmlFor="role">Роль (необязательно)</label>
        <input id="role" value={draft.role} onChange={(e) => update("role", e.target.value)} />
        <p>{dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}</p>
        {/* disabled — удобство интерфейса; проверка в save остаётся обязательной. */}
        <button type="submit" disabled={!dirty || Boolean(error)}>Сохранить</button>
        <button type="button" disabled={!dirty} onClick={cancel}>Отменить</button>
      </form>
      <p role="status">{message}</p>
    </main>
  );
}
