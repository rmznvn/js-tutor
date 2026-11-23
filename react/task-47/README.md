# Task 47 — Conference agenda planner

**Difficulty:** Junior+  
**Main topic:** Derived state with dates and Intl  
**Supporting topics:** Controlled inputs, immutable array updates, map, reduce, some, conditional rendering

## Scenario and requirements

An event organizer edits the start time and duration of each agenda session. Calculate every start/end time, total duration, invalid-duration warnings, and whether the agenda exceeds a 90-minute budget.

### Done when

- Start time and durations are controlled inputs.
- Updating one duration creates a new array and a new changed object.
- Session start/end labels are derived rather than stored.
- Time labels use Intl.DateTimeFormat.
- Empty or incomplete start time returns an empty schedule safely.
- Durations below five minutes and an exceeded budget show separate warnings.

### Edge cases

- The time input becomes temporarily empty.
- A duration is zero or below the minimum.
- The total is exactly 90 minutes versus 91 minutes.

Estimated time: **45–60 minutes**.

## Interview hints: how to reason

Ask whether sessions can cross midnight, whether the date itself matters, and whether invalid durations should be excluded or displayed with a warning. For this exercise, use one fixed date because only time-of-day labels matter.

Store only values the user edits. The calculated schedule, total, and warnings are derived from that state during render.

## Example candidate answers

> I store startTime and the editable session array. I do not store calculated start and end labels because that would duplicate information and create synchronization problems.

> I use map to replace only the changed session and spread to create a new object. React can then observe the new references without any direct mutation.

> Intl.DateTimeFormat separates formatting from arithmetic. The calculation works with Date objects, while the formatter controls how time is shown to the user.

## Step-by-step solution

1. Keep the time input and sessions in state.
2. Validate the HH:mm string before creating Date objects.
3. Parse the hours and minutes.
4. Walk through sessions with a cursor date.
5. Copy the current cursor for the start, add duration, and copy for the end.
6. Format both dates with one reusable Intl formatter.
7. Derive the total and warnings with reduce and some.

### Common mistakes

- Storing calculated schedule rows as another state value.
- Mutating a session object or the sessions array.
- Treating an empty time input as midnight unintentionally.
- Mixing date arithmetic with hand-built localized display strings.

### Manual checks

- Change Product demo to 40 minutes and verify later sessions move.
- Set total to exactly 90 and confirm no over-budget warning.
- Increase it to 95 and confirm the warning says 5 minutes.
- Clear the time input and confirm no crash occurs.

## Alternative approach

Represent all times as minutes since midnight and format the result manually. This avoids Date objects and can be simpler for schedules longer than 24 hours. Date plus Intl is more representative when localized time display is required.

## Full working code

Run npm ci, then npm run dev. The commented component is in [src/App.jsx](src/App.jsx).
