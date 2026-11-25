import { useState } from "react";

const initialState = {
  seats: [
    { id: "A1", guest: "Maya" },
    { id: "A2", guest: "Leo" },
    { id: "A3", guest: null },
  ],
  waitlist: ["Nora", "Sam"],
  message: "",
};

function cancelReservation(currentState, seatId) {
  const seat = currentState.seats.find((item) => item.id === seatId);
  if (!seat?.guest) return currentState;

  const promotedGuest = currentState.waitlist.at(0) ?? null;
  const nextSeats = currentState.seats.map((item) =>
    item.id === seatId ? { ...item, guest: promotedGuest } : item,
  );

  return {
    seats: nextSeats,
    // Remove only the promoted first person; keep the queue unchanged when it is empty.
    waitlist: promotedGuest ? currentState.waitlist.slice(1) : currentState.waitlist,
    message: promotedGuest
      ? `${seat.guest} cancelled. ${promotedGuest} moved from the waitlist to ${seatId}.`
      : `${seat.guest} cancelled. ${seatId} is now available.`,
  };
}

export default function App() {
  const [booking, setBooking] = useState(initialState);

  function handleCancel(seatId) {
    // Functional state ensures the transition receives the latest queue and seats.
    setBooking((currentBooking) => cancelReservation(currentBooking, seatId));
  }

  const occupiedCount = booking.seats.filter((seat) => seat.guest).length;

  return (
    <main>
      <h1>Workshop reservations</h1>
      <p>{occupiedCount} of {booking.seats.length} seats occupied</p>
      <ul>
        {booking.seats.map((seat) => (
          <li key={seat.id}>
            <strong>{seat.id}</strong>: {seat.guest ?? "Available"}{" "}
            {seat.guest && <button type="button" onClick={() => handleCancel(seat.id)}>Cancel</button>}
          </li>
        ))}
      </ul>
      <h2>Waitlist</h2>
      {booking.waitlist.length > 0 ? <ol>{booking.waitlist.map((guest) => <li key={guest}>{guest}</li>)}</ol> : <p>The waitlist is empty.</p>}
      {booking.message && <p role="status">{booking.message}</p>}
    </main>
  );
}
