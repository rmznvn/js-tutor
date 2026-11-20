import { useState } from "react";

const rooms = [
  { id: "maple", name: "Maple Room", capacity: 2 },
  { id: "cedar", name: "Cedar Room", capacity: 1 },
  { id: "oak", name: "Oak Room", capacity: 2 },
];

const initialAttendees = [
  { id: 1, name: "Amina", roomId: null },
  { id: 2, name: "Jon", roomId: null },
  { id: 3, name: "Lena", roomId: null },
  { id: 4, name: "Marco", roomId: null },
];

export default function App() {
  // Each attendee stores only the selected room ID; room details remain fixed data.
  const [attendees, setAttendees] = useState(initialAttendees);
  const [message, setMessage] = useState("Assign each attendee to a room.");

  // Occupancy is derived from attendees, so it cannot become stale independently.
  const occupancy = attendees.reduce((counts, attendee) => {
    if (attendee.roomId) {
      counts[attendee.roomId] = (counts[attendee.roomId] ?? 0) + 1;
    }
    return counts;
  }, {});

  function assignRoom(attendeeId, nextRoomId) {
    const attendee = attendees.find(({ id }) => id === attendeeId);
    const room = rooms.find(({ id }) => id === nextRoomId);

    // An empty value means “unassigned” and does not need a capacity check.
    if (room && attendee?.roomId !== nextRoomId) {
      const currentOccupancy = occupancy[nextRoomId] ?? 0;

      // Keep this guard even though full options are disabled in the interface.
      if (currentOccupancy >= room.capacity) {
        setMessage(`${room.name} is already full.`);
        return;
      }
    }

    setAttendees((currentAttendees) =>
      currentAttendees.map((currentAttendee) =>
        currentAttendee.id === attendeeId
          ? { ...currentAttendee, roomId: nextRoomId || null }
          : currentAttendee
      )
    );

    setMessage(nextRoomId ? "Assignment updated." : "Attendee is now unassigned.");
  }

  const unassignedCount = attendees.filter(({ roomId }) => !roomId).length;

  return (
    <main>
      <h1>Workshop room assignments</h1>

      <section aria-label="Room occupancy">
        <h2>Occupancy</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              {room.name}: {occupancy[room.id] ?? 0}/{room.capacity}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Attendees</h2>
        {attendees.map((attendee) => (
          <label key={attendee.id}>
            {attendee.name}
            <select
              value={attendee.roomId ?? ""}
              onChange={(event) => assignRoom(attendee.id, event.target.value)}
            >
              <option value="">Unassigned</option>
              {rooms.map((room) => {
                const isCurrentRoom = attendee.roomId === room.id;
                const isFull = (occupancy[room.id] ?? 0) >= room.capacity;

                return (
                  <option
                    key={room.id}
                    value={room.id}
                    disabled={isFull && !isCurrentRoom}
                  >
                    {room.name} ({occupancy[room.id] ?? 0}/{room.capacity})
                  </option>
                );
              })}
            </select>
          </label>
        ))}
      </section>

      <p>{unassignedCount} attendee(s) still unassigned.</p>
      <p aria-live="polite">{message}</p>
    </main>
  );
}
