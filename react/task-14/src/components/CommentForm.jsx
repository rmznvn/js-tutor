import { useState } from "react";
const COMMENT_LIMIT = 120;
function validateComment(comment) {
  const length = comment.length; // Считаем также крайние пробелы.
  if (comment.trim() === "") return { isValid: false, length, error: "Введите комментарий." };
  if (length > COMMENT_LIMIT) return {
    isValid: false, length,
    error: "Сократите комментарий на " + (length - COMMENT_LIMIT) + " симв.",
  };
  return { isValid: true, length, error: "" };
}
export default function CommentForm() {
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Ошибка, длина и доступность кнопки пересчитываются из текста.
  const validation = validateComment(comment);
  function submit(event) {
    event.preventDefault();
    if (!validation.isValid) return;
    setComment("");
    setSuccessMessage("Учебный комментарий принят. Запрос на сервер не выполнялся.");
  }
  return <main><h1>Комментарий</h1><form onSubmit={submit} noValidate>
    <label htmlFor="comment">Комментарий</label>
    {/* maxlength намеренно отсутствует, чтобы можно было показать превышение. */}
    <textarea id="comment" rows={5} value={comment} onChange={(event) => {
      setComment(event.target.value);
      setSuccessMessage("");
    }} aria-invalid={!validation.isValid} aria-describedby="counter error" />
    <p id="counter">Использовано: {validation.length} из {COMMENT_LIMIT}</p>
    {/* Постоянный элемент гарантирует существующий адрес aria-describedby. */}
    <p id="error" role="alert">{validation.error}</p>
    <button type="submit" disabled={!validation.isValid}>Отправить</button>
    <p role="status">{successMessage}</p>
  </form></main>;
}
