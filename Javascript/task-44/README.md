# Task 44 — Keyboard command palette

## Scenario and requirements

Build a command palette for a dashboard. A user opens it, searches commands by label or keyword, moves through results with the keyboard, executes a command, and closes the palette with Escape.

### Done when

- Search ignores letter case and surrounding spaces.
- Arrow Down and Arrow Up wrap through visible results.
- Enter executes the active command; Escape closes the palette.
- A new query resets the active result to the first item.
- An empty result does not cause an index error.
- Focus moves into the search field when opened and returns to the opener when closed.

### Edge cases

- The query contains only spaces.
- Filtering removes the previously active command.
- No commands match, then the user presses Enter or an arrow key.

Estimated time: **50–65 minutes**.

## Interview hints: how to reason

Ask whether matching includes keywords, whether navigation wraps, and what “execute” should do in this exercise. Separate pure filtering from interface state. Store only `isOpen`, `query`, and `activeIndex`; calculate visible commands from the query. Whenever the visible list changes, ensure the index is valid.

## Example candidate answers

> I will make filtering a pure function so I can verify it without the DOM. I combine the label and keywords into one normalized string because the same matching rule applies to both.

> The active item is a position inside the filtered list, so I reset it to zero after every query change. For keyboard wrapping, modulo avoids separate first-item and last-item branches.

> I will guard the empty state before reading an item. Enter should do nothing when no result exists, and arrow keys should not change the index. I will also return focus to the opening button when the palette closes.

## Step-by-step solution

1. Normalize and filter the command data.
2. Derive visible commands from the stored query.
3. Render result items and mark the active option.
4. Reset the active index when the input changes.
5. Move the index with wrapped modulo arithmetic.
6. Execute only when the active command exists.
7. Use event delegation for pointer selection.

### Common mistakes

- Keeping an index that is outside the newly filtered array.
- Reading result zero when the array is empty.
- Filtering DOM elements instead of the original data.
- Closing the palette without restoring focus.

### Manual checks

- Search `CSV` and confirm that “Export report” appears through its keyword.
- Press Arrow Up from the first result and confirm it wraps to the last.
- Search an unknown value and press Enter; nothing should throw.
- Press Escape and confirm focus returns to “Open command palette”.

## Alternative approach

Store the active command ID instead of its index. An ID survives reordering more naturally, but every filter change must verify whether that ID is still visible and select a fallback. An index is concise for this small transient result list.

## Full working code

Open [index.html](index.html). The fully commented implementation is in [script.js](script.js).
