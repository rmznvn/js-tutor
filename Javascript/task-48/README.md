# Task 48 — Subscription renewal notices

**Main topic:** dates and `Intl`  
**Supporting topics:** validation, `map`, non-mutating sorting, DOM creation  
**Difficulty:** confident junior+

Build a renewal dashboard that validates ISO dates, classifies each subscription as overdue, today, upcoming, or invalid, sorts valid records by date, and formats dates and prices for the chosen locale.

## Ready when

- Calendar-day differences are stable across time zones.
- Invalid and impossible dates do not crash rendering.
- Overdue, today, and future records have correct messages.
- The input array is not mutated.

## Interview thinking

Ask whether dates represent calendar days or exact moments, how invalid records should appear, and which locale/currency to use. I would say: “I parse the strict `YYYY-MM-DD` shape at UTC midnight because the requirement concerns calendar days. I inject today so the function is deterministic and easy to test. `Intl` handles presentation, while numeric day differences drive the business logic.”

## Common mistakes and checks

- `new Date("bad")` silently creates an invalid date; validate before arithmetic.
- Local-midnight calculations may cross daylight-saving changes.
- `sort()` mutates; use `toSorted()` or `[...array].sort()`.
- Check overdue, exactly today, zero price, invalid price, and `2026-02-31`.

## Alternative

Use `[...result].sort()` if the target does not support `toSorted()`. It is more widely compatible but slightly less explicit than the modern immutable method.

The complete commented solution is in [script.js](script.js), and the full release explanation is in [../../releases/2026-11-25.md](../../releases/2026-11-25.md).
