# Task 43 — Tournament bracket in JavaScript

This is the JavaScript version of the same exercise as [React task 44](../../react/task-44/).

## Scenario and requirements

Four players compete in two semifinals. The user chooses each semifinal winner, then chooses the champion from those two finalists. If a semifinal winner changes, a champion who is no longer a finalist must be cleared.

### Done when

- Each semifinal select contains only its two players.
- The final is disabled until both semifinal winners exist.
- Final options are derived from the semifinal winners.
- An invalid champion is reset after a semifinal change.
- Rendering never leaves a selected value that is absent from its options.

### Edge cases

- Only one semifinal winner has been chosen.
- A semifinal winner changes before the champion is chosen.
- A semifinal winner changes after the old winner was champion.

Estimated time: **40–55 minutes per version**.

## Interview hints: how to reason

Ask whether changing a semifinal should always reset the champion or only when the champion becomes invalid. Keep semifinal winners and champion as state. Derive finalists from the semifinal winners. Put the invariant in one place: the champion must be empty or included in the finalists.

In JavaScript, state changes and DOM rendering are explicit. Build select options from the current data, restore selected values, and call `render` after every state transition.

## Example candidate answers

> I will derive finalists because they can always be calculated from the two semifinal winners. Storing another finalists array would create duplicated state that could become stale.

> When a semifinal changes, I will create the next state first. Then I will check whether its champion still appears in the next finalists. This enforces the business rule before rendering.

> In the DOM version, I need to rebuild options and assign `.value` explicitly. In React, controlled selects perform that synchronization from state during render.

## Step-by-step solution

1. Represent both semifinal pairings as fixed data.
2. Store the three user decisions.
3. Create `getFinalists` as a pure derived-data function.
4. Create `updateSemifinal` to return a new state and clear an invalid champion.
5. Render every select from the current data and state.
6. On change, update state and render again.

### Common mistakes and checks

- Do not store finalists separately.
- Do not leave an old champion selected after changing their semifinal.
- Check the flow Ava + Chloe → Ava champion → change Ava to Ben: the champion must clear.
- Check that the final stays disabled with only one semifinal result.

## Alternative approach

Always clear the champion whenever either semifinal changes. It is simpler and defensible if every changed match invalidates confirmation. The main solution preserves the champion when the same valid player remains, which causes fewer unnecessary resets.

## Full working code

Open [index.html](index.html). The complete commented implementation is in [script.js](script.js).
