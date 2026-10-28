import { useState } from "react";

const initialArticles = [
  { id: 1, title: "React: состояние", note: "Повторить функциональное обновление." },
  { id: 2, title: "Webflow CMS", note: "Проверить поля коллекции." },
  { id: 3, title: "Доступность", note: "" },
];
const NOTE_LIMIT = 80;

function NoteEditor({ article, onSave }) {
  // Начальное значение читается при создании экземпляра редактора.
  // Новые props сами по себе не переинициализируют useState.
  const [draft, setDraft] = useState(article.note);
  const isTooLong = draft.length > NOTE_LIMIT;
  const hasChanges = draft !== article.note;

  function save(event) {
    event.preventDefault();
    if (isTooLong || !hasChanges) return;
    onSave(article.id, draft); // Пустую строку тоже можно сохранить: это очистка заметки.
  }

  return (
    <form onSubmit={save}>
      <h2>Заметка: {article.title}</h2>
      <label htmlFor="note">Текст заметки</label>
      <textarea id="note" value={draft} onChange={(event) => setDraft(event.target.value)}
        aria-invalid={isTooLong} aria-describedby="note-count note-error" />
      <p id="note-count">{draft.length} из {NOTE_LIMIT}</p>
      <p id="note-error" role="alert">{isTooLong ? "Сократите заметку до 80 символов." : ""}</p>
      <button type="submit" disabled={isTooLong || !hasChanges}>Сохранить заметку</button>
      <button type="button" onClick={() => setDraft(article.note)}>Отменить изменения</button>
    </form>
  );
}

export default function ArticleNotes() {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedId, setSelectedId] = useState(1);
  const selectedArticle = articles.find((article) => article.id === selectedId);

  function saveNote(id, note) {
    // Новый массив и новый объект только для изменённой статьи.
    setArticles((current) => current.map((article) =>
      article.id === id ? { ...article, note } : article
    ));
  }

  return (
    <main>
      <h1>Заметки к статьям</h1>
      <p>Переключение статьи отменяет несохранённый черновик.</p>
      <div role="group" aria-label="Выберите статью">
        {articles.map((article) => (
          <button key={article.id} type="button" aria-pressed={article.id === selectedId}
            onClick={() => setSelectedId(article.id)}>{article.title}</button>
        ))}
      </div>
      {/* Смена key создаёт новый экземпляр с note другой статьи.
          При повторном выборе той же статьи key не меняется — черновик сохраняется. */}
      {selectedArticle && <NoteEditor key={selectedArticle.id}
        article={selectedArticle} onSave={saveNote} />}
    </main>
  );
}
