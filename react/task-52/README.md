# React Task 52 — Exact shared-bill balances

**Main topic:** controlled numeric inputs and derived state  
**Supporting topics:** reduce, some, integer cents, Intl.NumberFormat  
**Difficulty:** junior+ to middle

Let three people enter how much they paid. Derive the total and show who owes or should receive money. Perform arithmetic in integer cents and distribute remainder cents deterministically.

Explain why input values remain strings, why money arithmetic uses cents, and why balances are derived rather than stored. Check zero total, invalid/negative input, decimals, and a total not divisible by the participant count.

An alternative is assigning the final rounding difference to the last participant. The chosen approach distributes extra cents from the first participant onward and always preserves the exact total.

Run npm ci, npm run lint, and npm run dev. See the [complete release](../../releases/2026-11-27.md).
