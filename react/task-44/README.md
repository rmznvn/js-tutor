# Task 44 — Tournament bracket in React

This is the React version of the same exercise as [JavaScript task 43](../../Javascript/task-43/).

## Scenario and requirements

Four players compete in two semifinals. Choose each winner, then choose a champion from the two finalists. Changing a semifinal must clear a champion who is no longer valid.

### Done when

- All selects are controlled.
- Finalists are derived during render.
- The final is disabled until it has two finalists.
- A semifinal update checks the next possible finalists and resets an invalid champion.
- No effect hook is required.

### Edge cases

- One or both semifinal values are empty.
- A losing finalist replaces the current champion.
- Re-selecting a still-valid result should not create inconsistent state.

Estimated time: **40–55 minutes per version**.

## Interview hints: how to reason

Ask what data is fixed, what the user can change, and what can be calculated. Store only the three choices. Derive the finalist array. Enforce the relationship while handling the event that changes it; waiting for an effect would add an unnecessary second render and is outside this task’s required knowledge.

## Example candidate answers

> I will keep each select controlled with `value` and `onChange`. The semifinal winners and champion are genuine state because the user changes them. The finalists are derived and should not be stored.

> State updates are scheduled, so inside the change handler I cannot assume the state variable already contains the new winner. I will build `nextFinalists` with the event value and the unchanged semifinal value, then validate the champion against that array.

> I will test the invariant by choosing a champion and then replacing that player in the semifinal. The champion select and summary should both reset immediately.

## Step-by-step solution

1. Create state for the two semifinal winners and champion.
2. Derive `finalists` with an array and `filter(Boolean)`.
3. Render controlled selects from the match data.
4. In a semifinal handler, compute the finalists after the requested change.
5. Clear the champion only if it is absent from that next array.
6. Disable the final until two finalist values exist.

### Common mistakes and checks

- Do not call a setter and immediately read the old state as if it changed synchronously.
- Do not add `finalists` state.
- Use stable player names as keys because they are unique in this dataset.
- Test Ava + Chloe → Chloe champion → change Chloe to Diego: champion clears.

## Alternative approach

A single object state `{ semi1Winner, semi2Winner, champion }` can make the transition resemble a small state machine and simplify a future move to `useReducer`. Separate state variables remain easier at this level and fit the confirmed topics.

## Full working code

Run `npm ci`, then `npm run dev`. The complete commented component is in [src/App.jsx](src/App.jsx).
