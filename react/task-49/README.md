# React Task 49 — Editable league standings

**Main topic:** derived state  
**Supporting topics:** controlled inputs, immutable nested updates, `Map`, sorting  
**Difficulty:** junior+

Render editable match scores and derive a standings table with played matches, goal difference, and points. Sort by points, then goal difference, then team name.

## Ready when

- Every score input is controlled.
- Updating one score creates a new match object and a new array.
- Standings update immediately and are not stored as separate state.
- Draws give one point to each team; wins give three points.

## Candidate explanation

“Matches are the source of truth. Standings can always be calculated from them, so storing both would risk inconsistent data. I use `Map` because teams are keyed by unique names, then convert its values to an array for sorting and rendering.”

## Checks and alternative

Check a draw, home win, away win, zero score, and a tie in both points and goal difference. An object accumulator also works, but `Map` expresses keyed entries clearly and avoids prototype-key edge cases.

Run `npm ci`, `npm run lint`, and `npm run dev`. The full explanation is in [../../releases/2026-11-25.md](../../releases/2026-11-25.md).
