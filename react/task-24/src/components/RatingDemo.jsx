import { useState } from "react";

function StarRating() {
  const [rating, setRating] = useState(0);
  const [preview, setPreview] = useState(null);
  // Подсветка производна от двух состояний; хранить её отдельно не нужно.
  const visibleRating = preview ?? rating;
  const scores = [1, 2, 3, 4, 5];

  function selectRating(score) {
    setRating(score);
    setPreview(null);
  }

  function clearRating() {
    setRating(0);
    setPreview(null);
  }

  return (
    <section aria-label="Оценка материала">
      <div className="stars" role="group" aria-label="Выберите оценку"
        onMouseLeave={() => setPreview(null)}>
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            className={score <= visibleRating ? "is-filled" : ""}
            aria-label={"Оценить на " + score + " из 5"}
            aria-pressed={score === rating}
            onMouseEnter={() => setPreview(score)}
            onFocus={() => setPreview(score)}
            onBlur={() => setPreview(null)}
            onClick={() => selectRating(score)}
          >
            {/* Цвет показывает предпросмотр, aria-pressed — сохранённый выбор. */}
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>
      <p role="status">
        {rating === 0 ? "Оценка не выбрана" : "Ваша оценка: " + rating + " из 5"}
      </p>
      <button type="button" disabled={rating === 0} onClick={clearRating}>Очистить оценку</button>
    </section>
  );
}

export default function RatingDemo() {
  return <main><h1>Оцените материал</h1><StarRating /></main>;
}
