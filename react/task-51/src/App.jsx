import { useState } from "react";

const statuses = ["backlog", "in-progress", "done"];
const initialTickets = [
  { id: 1, title: "Add empty state", status: "backlog" },
  { id: 2, title: "Fix keyboard focus", status: "in-progress" },
  { id: 3, title: "Review error copy", status: "done" },
  { id: 4, title: "Test mobile menu", status: "backlog" },
];

function TicketCard({ ticket, onMove }) {
  const statusIndex = statuses.indexOf(ticket.status);
  return (
    <article>
      <h3>{ticket.title}</h3>
      <button type="button" disabled={statusIndex === 0} onClick={() => onMove(ticket.id, -1)}>Previous</button>
      <button type="button" disabled={statusIndex === statuses.length - 1} onClick={() => onMove(ticket.id, 1)}>Next</button>
    </article>
  );
}

export default function App() {
  const [tickets, setTickets] = useState(initialTickets);

  function moveTicket(ticketId, direction) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        const currentIndex = statuses.indexOf(ticket.status);
        const nextIndex = currentIndex + direction;
        // Ignore transitions outside the workflow boundaries.
        if (nextIndex < 0 || nextIndex >= statuses.length) return ticket;
        // Copy only the ticket whose status changes.
        return { ...ticket, status: statuses[nextIndex] };
      }),
    );
  }

  // Columns and counts are derived from the ticket source state.
  const columns = statuses.map((status) => ({
    status,
    tickets: tickets.filter((ticket) => ticket.status === status),
  }));

  return (
    <main>
      <h1>Release board</h1>
      <div className="board">
        {columns.map((column) => (
          <section key={column.status} aria-labelledby={column.status}>
            <h2 id={column.status}>{column.status} ({column.tickets.length})</h2>
            {column.tickets.length === 0 ? (
              <p>No tickets</p>
            ) : (
              column.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onMove={moveTicket} />
              ))
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
