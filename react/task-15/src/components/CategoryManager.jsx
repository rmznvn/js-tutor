import { useState } from "react";
const initialCategories = [
  {id:1,title:"Webflow"},{id:2,title:"JavaScript"},{id:3,title:"React"},
];
function getTitleError(categories, editingId, draftTitle) {
  const prepared = draftTitle.trim();
  if (prepared === "") return "Название категории обязательно.";
  // some возвращает true, если найден хотя бы один дубль; текущий ID исключён.
  const duplicate = categories.some((category) =>
    category.id !== editingId && category.title.trim().toLowerCase() === prepared.toLowerCase());
  return duplicate ? "Категория с таким названием уже существует." : "";
}
function CategoryItem({ category, isEditing, draftTitle, error, onDraft, onStart, onSave, onCancel, onDelete }) {
  return <li>{isEditing ? <div>
    <label htmlFor={"category-" + category.id}>Название категории</label>
    <input id={"category-" + category.id} value={draftTitle}
      onChange={(event) => onDraft(event.target.value)} aria-invalid={Boolean(error)}
      aria-describedby={error ? "category-error" : undefined} />
    {error && <p id="category-error" role="alert">{error}</p>}
    <button type="button" disabled={Boolean(error)} onClick={onSave}>Сохранить</button>
    <button type="button" onClick={onCancel}>Отмена</button>
  </div> : <div>{category.title}
    <button type="button" onClick={() => onStart(category)}>Редактировать</button>
  </div>}
    {/* Удаление остаётся доступным и у редактируемой строки. */}
    <button type="button" onClick={() => onDelete(category.id)}>Удалить</button>
  </li>;
}
export default function CategoryManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const error = editingId === null ? "" : getTitleError(categories, editingId, draftTitle);
  function cancel() { setEditingId(null); setDraftTitle(""); }
  function start(category) {
    setEditingId(category.id);
    setDraftTitle(category.title); // Черновик отделён от настоящего объекта.
  }
  function save() {
    if (editingId === null || error) return;
    const title = draftTitle.trim();
    setCategories((current) => current.map((category) =>
      category.id === editingId ? {...category, title} : category));
    cancel();
  }
  function remove(id) {
    setCategories((current) => current.filter((category) => category.id !== id));
    if (editingId === id) cancel();
  }
  return <main><h1>Категории CMS</h1><p>Всего категорий: {categories.length}</p>
    {categories.length === 0 ? <p>Категорий пока нет.</p> : <ul>
      {categories.map((category) => <CategoryItem key={category.id} category={category}
        isEditing={category.id === editingId} draftTitle={draftTitle}
        error={category.id === editingId ? error : ""}
        onDraft={setDraftTitle} onStart={start} onSave={save} onCancel={cancel} onDelete={remove} />)}
    </ul>}
  </main>;
}
