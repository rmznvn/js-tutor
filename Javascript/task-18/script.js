const STORAGE_KEY = "articleDraft";
const SAVE_DELAY = 700;
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusElement = document.getElementById("status");
const form = document.getElementById("article-form");
// Внешняя переменная позволяет отменить предыдущий таймер.
let saveTimerId = null;
function getCurrentDraft() {
  return { title: titleInput.value, content: contentInput.value };
}
function draftHasContent(draft) {
  return draft.title.trim() !== "" || draft.content.trim() !== "";
}
function saveDraft(draft) {
  try {
    if (!draftHasContent(draft)) {
      localStorage.removeItem(STORAGE_KEY);
      statusElement.textContent = "Пустой черновик не сохранён.";
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    statusElement.textContent = "Черновик сохранён.";
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Не удалось сохранить черновик.";
  }
}
function readDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return null;
    const draft = JSON.parse(saved); // Может выбросить исключение.
    // Корректный JSON ещё не гарантирует ожидаемые поля.
    if (typeof draft !== "object" || draft === null ||
        typeof draft.title !== "string" || typeof draft.content !== "string") return null;
    return draft;
  } catch (error) { console.warn(error); return null; }
}
function restoreDraft() {
  const draft = readDraft();
  if (!draft) { statusElement.textContent = "Сохранённого черновика нет."; return; }
  titleInput.value = draft.title;
  contentInput.value = draft.content;
  statusElement.textContent = "Черновик восстановлен.";
}
function scheduleDraftSave() {
  if (saveTimerId !== null) clearTimeout(saveTimerId);
  statusElement.textContent = "Есть несохранённые изменения.";
  saveTimerId = setTimeout(() => {
    saveDraft(getCurrentDraft()); // Читаем актуальные поля после паузы.
    saveTimerId = null;
  }, SAVE_DELAY);
}
form.addEventListener("input", scheduleDraftSave);
form.addEventListener("submit", (event) => event.preventDefault());
document.getElementById("clear").addEventListener("click", () => {
  // Отменяем отложенную операцию при явной очистке.
  if (saveTimerId !== null) clearTimeout(saveTimerId);
  saveTimerId = null;
  titleInput.value = "";
  contentInput.value = "";
  try {
    localStorage.removeItem(STORAGE_KEY);
    statusElement.textContent = "Черновик очищен.";
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Поля очищены, но хранилище недоступно.";
  }
  titleInput.focus();
});
restoreDraft();
