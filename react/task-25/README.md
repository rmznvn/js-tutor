# Черновик заметки и сброс через key — React

Выпуск **2026-10-28**. Время: 35–45 минут.

## Условие

Редактор переключает статьи и пишет личные заметки. При переключении несохранённый черновик должен исчезать, сохранённый текст — оставаться.

### Входные данные и критерии готовности

- Статьи: React: состояние с заметкой о функциональном обновлении; Webflow CMS с заметкой о полях коллекции; Доступность с пустой заметкой.
- Родитель хранит articles и selectedId; NoteEditor хранит локальный draft.
- Редактор получает key={article.id}; смена статьи создаёт новый экземпляр и новый initial state.
- До 80 символов включительно; пустая строка допустима и очищает заметку.
- Сохранить обновляет только выбранный объект через map; отмена возвращает текущий сохранённый текст.
- Одинаковый повторный выбор статьи не сбрасывает черновик. useEffect/useRef не нужны.

### Крайние случаи

- Несохранённый текст A → B → A: старый сохранённый текст A.
- Сохранить A → B → A: новый текст A.
- 81 символ блокирует сохранение; пустая заметка допустима.

## Как рассуждать

- Почему useState(article.note) сам не обновится при новых props?
- Что означает смена key?
- Где хранить сохранённое и черновик?

Сначала предскажи результат одного действия на маленьком примере. Раздели входные данные, состояние и вычисляемые значения. Выбери метод после определения нужного преобразования.

## Примеры ответов вслух

> «Аргумент useState задаёт начальное значение экземпляра, а не синхронизацию с каждым новым prop. Без сброса старый черновик мог бы остаться при переключении статьи.»

> «Другой key означает другой экземпляр компонента в этом месте дерева. React удалит старое локальное состояние и создаст новое из note другой статьи.»

> «Сохранённые данные принадлежат родителю, черновик — редактору. Callback передаст ID и текст для map. Проверю переключение до и после сохранения и повторный выбор того же ID.»

## Пошаговый разбор

1. Создать articles и selectedId у родителя.
2. Найти выбранную статью.
3. Передать её редактору с key по ID.
4. Инициализировать локальный draft сохранённой заметкой.
5. Вычислить длину, ошибку и наличие изменений.
6. Сохранить callback через map; отменить локальным setter.
7. Проверить пересоздание при новом key.

## Типичные ошибки

- Ожидать переинициализацию useState от новых props.
- Случайный key пересоздаёт редактор при каждом рендере.
- Индекс вместо ID создаёт неправильную связь.
- Менять заметку в родителе на каждый ввод — тогда отменять нечего.

## Альтернативный способ

Поднять draft в родителя и сбрасывать его явно в обработчике переключения. Это позволяет хранить черновики нескольких статей, но добавляет координацию. key подходит, когда весь локальный редактор должен начинаться заново.

## Ручная проверка

Измени первую заметку без сохранения, переключись туда-обратно — черновик исчез. Сохрани и повтори — текст остался. Проверь 80/81 символ, отмену и пустую строку.

## Запуск

Из папки задачи: `npm ci`, затем `npm run dev`. В Codespaces: `npm run dev -- --host 0.0.0.0`, затем Open in Browser. Сборка: `npm run build`.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### src/components/ArticleNotes.jsx

```jsx
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

```

</details>
