# Task 51 — Accessibility audit queue

**Main topic:** flatMap, Map, and Set  
**Supporting topics:** destructuring, optional defaults, filtering, sorting  
**Difficulty:** junior+

Flatten nested page → section → issue audit data, retain unresolved issues, deduplicate issue types, count severities, and sort high-priority work first.

Explain why two flatMap calls remove two collection levels, why Set represents uniqueness, and why Map represents keyed counts. Check empty pages, empty sections, unknown severity, and all-resolved input.

An alternative is nested for-of loops. They are easier to debug step by step, while the transformation pipeline is compact once the nesting is understood.

See [script.js](script.js) and the [complete release](../../releases/2026-11-27.md).
