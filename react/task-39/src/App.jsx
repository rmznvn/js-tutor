import { useState } from "react";

const MAX_GUESTS = 3;

export default function GuestList() {
  // Следующий ID хранится вместе со списком, без случайных ключей в render.
  const [state, setState] = useState({
    guests: [{ id: 1, name: "" }],
    nextId: 2,
  });

  function addGuest() {
    setState((current) => {
      // Проверяем лимит также в обработчике.
      if (current.guests.length >= MAX_GUESTS) return current;
      return {
        guests: [...current.guests, { id: current.nextId, name: "" }],
        nextId: current.nextId + 1,
      };
    });
  }

  function updateGuest(id, name) {
    setState((current) => ({
      ...current,
      guests: current.guests.map((guest) =>
        guest.id === id ? { ...guest, name } : guest
      ),
    }));
  }

  function removeGuest(id) {
    setState((current) => {
      // Оставляем хотя бы одну строку.
      if (current.guests.length === 1) return current;
      return {
        ...current,
        guests: current.guests.filter((guest) => guest.id !== id),
      };
    });
  }

  // Пробельное имя не считается заполненным.
  const filledCount = state.guests.filter(
    (guest) => guest.name.trim() !== ""
  ).length;

  return (
    <main>
      <h1>Участники встречи</h1>
      <p>Можно добавить от одного до трёх участников.</p>
      <ul>
        {state.guests.map((guest) => (
          // Стабильный ID сохраняет соответствие поля и участника при удалении.
          <li key={guest.id}>
            <label htmlFor={"guest-" + guest.id}>
              Имя участника {guest.id}
            </label>
            <input
              id={"guest-" + guest.id}
              value={guest.name}
              onChange={(event) => updateGuest(guest.id, event.target.value)}
            />
            <button
              type="button"
              aria-label={"Удалить участника " + guest.id}
              disabled={state.guests.length === 1}
              onClick={() => removeGuest(guest.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={state.guests.length >= MAX_GUESTS}
        onClick={addGuest}
      >
        Добавить участника
      </button>
      <p role="status">
        Строк: {state.guests.length}. Заполнено: {filledCount}.
      </p>
    </main>
  );
}
