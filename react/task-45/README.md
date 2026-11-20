# Task 45 — Capacity-aware room assignments

## Scenario and requirements

Assign workshop attendees to rooms with different capacities. Every attendee has a controlled select. Full rooms cannot accept another attendee, but the person already assigned there must still see their current option enabled.

### Done when

- Assignments update immutably.
- Occupancy is derived from attendee assignments.
- Full rooms are disabled for other attendees.
- Moving a person immediately frees their old room.
- The update function also rejects a full room even if called outside the UI.
- The unassigned count is derived and displayed.

### Edge cases

- A room reaches its exact capacity.
- An attendee currently belongs to a full room.
- Moving someone from a full room makes it available to others.

Estimated time: **50–65 minutes**.

## Interview hints: how to reason

Ask whether people may remain unassigned and whether room capacity is fixed. Store each attendee’s selected room ID. Do not store occupancy because it can be calculated with `reduce`. For a room option, distinguish “full for someone else” from “the attendee’s current full room”. Keep a capacity guard in the handler as business logic, not only as disabled HTML.

## Example candidate answers

> The attendee assignments are state because the user changes them. Room definitions are fixed data. Occupancy is derived with `reduce`, which prevents a separate count from becoming inconsistent with the attendee list.

> I disable a full room only when it is not the attendee’s current room. Otherwise the controlled select would display a disabled current choice and create confusing behavior.

> I still validate capacity inside `assignRoom`. Disabled options improve the interface, but the state transition must also protect the rule if it is called another way.

## Step-by-step solution

1. Store attendees with `roomId` values.
2. Derive an occupancy object using `reduce` and `?? 0`.
3. Render controlled selects from attendee state.
4. For each room option, calculate `isFull` and `isCurrentRoom`.
5. Validate the requested room in the handler.
6. Update only the matching attendee with `map` and spread.
7. Derive the unassigned count with `filter`.

### Common mistakes

- Mutating an attendee object directly.
- Keeping occupancy as another state variable.
- Disabling the current option of someone already in a full room.
- Relying only on the DOM `disabled` attribute for validation.

### Manual checks

- Fill Cedar Room and confirm it becomes unavailable to the other attendees.
- Move its attendee to Maple Room and confirm Cedar becomes available.
- Fill Maple to 2/2 and confirm both occupants retain their current selection.
- Change an attendee to Unassigned and verify both counts update.

## Alternative approach

Store assignments as an object such as `{ attendeeId: roomId }` and keep attendee data separate. This is useful when attendee records must remain immutable server data. The array approach is easier to render and update at the current scale.

## Full working code

Run `npm ci`, then `npm run dev`. The fully commented component is in [src/App.jsx](src/App.jsx).
