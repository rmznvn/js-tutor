import { useState } from "react";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const initialSessions = [
  { id: 1, title: "Opening", durationMinutes: 15 },
  { id: 2, title: "Product demo", durationMinutes: 35 },
  { id: 3, title: "Questions", durationMinutes: 20 },
];

function createSchedule(startTime, sessions) {
  // An empty or incomplete controlled time input cannot create a valid schedule.
  if (!/^\d{2}:\d{2}$/.test(startTime)) return [];

  const [hours, minutes] = startTime.split(":").map(Number);

  // Use a fixed calendar date because only the time-of-day matters in this exercise.
  const cursor = new Date(2026, 0, 1, hours, minutes);

  if (Number.isNaN(cursor.getTime())) return [];

  return sessions.map((session) => {
    const start = new Date(cursor);
    cursor.setMinutes(cursor.getMinutes() + session.durationMinutes);
    const end = new Date(cursor);

    return {
      ...session,
      startLabel: timeFormatter.format(start),
      endLabel: timeFormatter.format(end),
    };
  });
}

export default function App() {
  const [startTime, setStartTime] = useState("09:00");
  const [sessions, setSessions] = useState(initialSessions);

  function updateDuration(sessionId, nextValue) {
    const durationMinutes = Number(nextValue);

    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? { ...session, durationMinutes }
          : session
      )
    );
  }

  // Totals and calculated start/end labels are derived from actual state.
  const totalMinutes = sessions.reduce(
    (total, session) => total + session.durationMinutes,
    0
  );
  const schedule = createSchedule(startTime, sessions);
  const hasInvalidDuration = sessions.some(
    ({ durationMinutes }) => !Number.isFinite(durationMinutes) || durationMinutes < 5
  );
  const exceedsBudget = totalMinutes > 90;

  return (
    <main>
      <h1>Conference agenda planner</h1>

      <label>
        Agenda start time
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
      </label>

      <ul>
        {schedule.map((session) => (
          <li key={session.id}>
            <strong>{session.title}</strong>: {session.startLabel}–{session.endLabel}
            <label>
              Duration
              <input
                type="number"
                min="5"
                step="5"
                value={session.durationMinutes}
                onChange={(event) => updateDuration(session.id, event.target.value)}
              />
              minutes
            </label>
          </li>
        ))}
      </ul>

      <p>Total: {totalMinutes} minutes of a 90-minute budget.</p>

      {hasInvalidDuration && (
        <p role="alert">Every session must last at least 5 minutes.</p>
      )}

      {exceedsBudget && (
        <p role="alert">The agenda exceeds the budget by {totalMinutes - 90} minutes.</p>
      )}
    </main>
  );
}
