# Task 42 — Find adjacent cinema seats

## Scenario and requirements

A cinema row contains available and booked seats. A visitor enters a group size from 1 to 4. Show every block of adjacent available seats that can fit the group.

Input data:

```js
const seats = [
  { id: "A1", isAvailable: true },
  { id: "A2", isAvailable: true },
  { id: "A3", isAvailable: false },
  { id: "A4", isAvailable: true },
  { id: "A5", isAvailable: true },
  { id: "A6", isAvailable: true },
  { id: "A7", isAvailable: false },
  { id: "A8", isAvailable: true },
];
```

### Done when

- `findSeatBlocks(seats, groupSize)` returns all valid blocks as arrays of seat IDs.
- Booked seats break a block.
- The source array remains unchanged.
- Invalid sizes return an empty array; the UI shows a useful validation message.
- The page renders the row and updates the result after a button click.

### Edge cases

- The group size is `0`, decimal, empty, or larger than the row.
- There are no suitable adjacent seats.
- Overlapping valid blocks are allowed: three free seats contain two different two-seat blocks.

Estimated time: **35–50 minutes**.

## Interview hints: how to reason

Ask the interviewer:

1. Should overlapping blocks be returned?
2. Should the function return seat objects, indices, or IDs?
3. What should happen with invalid group sizes?

Reason from a moving starting position. At every possible index, inspect exactly `groupSize` seats. The last possible start is `seatList.length - groupSize`. Use `slice` to obtain a candidate without mutation and `every` to verify that all its seats are available.

Keep the seat-search function pure. Conversion from an input string and rendering belong to the DOM layer.

## Example candidate answers

> I would clarify whether overlapping results count. I will include them because each start position represents a valid booking choice. For A4–A6 and a group of two, both A4–A5 and A5–A6 are useful results.

> I will return IDs because they are stable and directly useful for the UI. I use `slice` because it creates a new candidate array, so the original row is not changed. Then `every` expresses the business rule that all seats in the candidate must be available.

> I will validate `groupSize` inside the pure function as well as in the UI. That makes the function safe if it is called from another interface later. I will manually test sizes 1, 2, 3, 0, and a value larger than the row.

## Step-by-step solution

1. Validate that the size is a positive integer that fits in the row.
2. Create an empty result array.
3. Loop through every start index where a complete group can fit.
4. Extract the candidate with `slice(start, start + groupSize)`.
5. Check the candidate with `every`.
6. Convert a valid candidate to IDs and append it to the result.
7. In the DOM handler, convert the input string with `Number`, call the pure function, and format the result.

### Common mistakes

- Using `< seatList.length - groupSize` and missing the final possible start.
- Treating a run of three seats as only one two-seat option.
- Calling `splice`, which mutates the source row.
- Forgetting that input values are strings.

### Manual checks

- Size 2 returns `A1–A2`, `A4–A5`, and `A5–A6`.
- Size 3 returns only `A4–A6`.
- Size 4 returns no block.
- Size 0 shows validation and does not throw.

## Alternative approach

Track the current run of available seats in one pass. When the run reaches the requested size, emit the last `groupSize` IDs. This avoids creating a candidate array for every start and is more efficient for very long rows. The window approach in the main solution is easier to explain and debug for a small UI; the running-count approach is preferable for large datasets.

## Full working code

Open [index.html](index.html). The complete commented implementation is in [script.js](script.js).
