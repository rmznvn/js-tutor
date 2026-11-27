# Task 50 — Closure-based inventory ledger

**Main topic:** closures and private state  
**Supporting topics:** Map, default parameters, references, DOM forms  
**Difficulty:** confident junior+

Build an equipment reservation form. A factory must keep stock inside a closure, validate positive integer quantities, reject over-reservation, and return safe snapshots.

Ask whether release may exceed original stock and whether unknown products are errors. Explain that JavaScript passes the reference value into the factory; copying each record prevents later outside mutation from reaching the private Map.

Check zero, decimals, missing products, insufficient stock, and mutation of a returned snapshot. An alternative is a class with private fields, but classes are outside this exercise.

See the full commented solution in [script.js](script.js) and the [complete release](../../releases/2026-11-27.md).
