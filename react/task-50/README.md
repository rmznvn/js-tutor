# React Task 50 — Reservation waitlist promotion

**Main topic:** atomic state transitions with functional updates  
**Supporting topics:** immutable arrays, `find`, `map`, `at`, `slice`, derived counts  
**Difficulty:** junior+

Display workshop seats and a FIFO waitlist. When an occupied seat is cancelled, promote the first waiting guest into that exact seat. If the queue is empty, make the seat available.

## Ready when

- Cancelling promotes only the first waiting guest.
- The promoted guest is removed from the queue.
- With an empty queue, the seat becomes available.
- Clicking an unavailable or empty seat transition does not corrupt state.
- Occupied count is derived rather than separately stored.

## Candidate explanation

“Seats and waitlist change together, so I keep them in one state object and calculate the next object in one functional update. The transition is a pure function, which makes edge cases easy to test. I replace only the changed seat and use `slice(1)` to create a new queue.”

## Alternative

Separate `seats` and `waitlist` states can work, but two setters make the transition easier to split accidentally. A reducer would suit a larger booking system, but it is outside this exercise’s confirmed React scope.

Run `npm ci`, `npm run lint`, and `npm run dev`. The full explanation is in [../../releases/2026-11-25.md](../../releases/2026-11-25.md).
