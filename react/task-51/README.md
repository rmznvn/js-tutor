# React Task 51 — Kanban workflow transitions

**Main topic:** immutable state transitions  
**Supporting topics:** derived columns, child callbacks, conditional rendering  
**Difficulty:** junior+

Render tickets in Backlog, In progress, and Done. Move one ticket one step forward or backward, disable invalid actions, and derive columns and counts from one ticket array.

The candidate should explain why the ticket array is the source of truth and why column arrays should not be separate state. Check both workflow boundaries and an empty column.

An alternative is storing columns as nested arrays, which can make drag-and-drop easier later but makes basic moves more complex.

Run npm ci, npm run lint, and npm run dev. See the [complete release](../../releases/2026-11-27.md).
