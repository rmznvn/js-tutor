# Task 46 — File validation queue in React

This is the React version of the same exercise as [JavaScript task 45](../../Javascript/task-45/).

## Scenario and requirements

Build the same client-side attachment queue with PDF/JPG/PNG validation, individual and combined size limits, duplicate protection, removal, and per-file errors.

### New small technique

`event.target.files` is a browser `FileList`. Convert it with `Array.from` before passing it to the validation function. The real `File` objects can be stored in state for this local queue; no upload or effect hook is required.

### Done when

- The validation helper remains independent of React.
- Queue files and the errors from a selection update together.
- State updates use previous state safely.
- Total size is derived during render.
- Removal is immutable and clears obsolete validation messages.

### Edge cases

- A batch contains both accepted and rejected files.
- A duplicate is selected after other files already exist.
- Removal changes whether a later file fits the total limit.

Estimated time: **50–70 minutes per implementation**.

## Interview hints: how to reason

Keep file rules in a pure function that both implementations can share. In React, store `{ files, errors }` together because one selection produces both values. Use a functional update because validation depends on the existing queue. Derive total bytes instead of storing them.

## Example candidate answers

> I keep the validation helper outside the component because it does not need React. That makes the behavior easier to test with plain file-like objects.

> I use one queue state object so files and the errors from the same event are returned in one pure transition. Calling another state setter inside a state updater would make that updater impure.

> The total is derived with `reduce`. Storing it would duplicate information already present in the file array and would require synchronization after every removal.

## Step-by-step solution

1. Define size and type constants outside the component.
2. Create pure ID and validation helpers.
3. Convert the selected `FileList` to an array.
4. Functionally update the queue with the helper’s result.
5. Reset the native input value.
6. Remove a file with `filter`.
7. Derive and display the combined total.

### Common mistakes and checks

- Do not mutate the files array with `push` inside React state.
- Do not call `setErrors` from inside a `setFiles` updater.
- Do not store the derived total.
- Test mixed valid/invalid files, a duplicate, exact limits, removal, and reselection.

## Alternative approach

Store only serializable metadata in React state and keep actual `File` objects in another layer. That can help when persisting drafts, because `File` objects cannot be serialized to JSON. For a local queue before submission, storing the objects directly is simpler.

## Full working code

Run `npm ci`, then `npm run dev`. The fully commented component is in [src/App.jsx](src/App.jsx).
