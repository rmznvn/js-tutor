# Task 48 — Volunteer availability matrix

**Difficulty:** Junior+  
**Main topic:** Nested immutable state  
**Supporting topics:** Controlled checkboxes, computed object entries, list keys, accessible tables, derived coverage

## Scenario and requirements

Volunteers mark which shifts they can attend. Build a matrix of controlled checkboxes and calculate coverage for every shift.

### Done when

- Each checkbox is controlled by React state.
- Toggling creates a new nested array and a new outer object.
- Coverage and total selections are derived.
- Shifts with zero volunteers appear in a warning.
- Rows and columns use stable IDs as keys.
- The table has row and column headers plus useful checkbox labels.

### Edge cases

- A volunteer has no state entry.
- A shift loses its final volunteer.
- All shifts have coverage and the warning disappears.

Estimated time: **40–55 minutes**.

## Interview hints: how to reason

Ask whether one volunteer may select several shifts and whether a shift has a maximum capacity. Here availability is many-to-many and has no maximum.

The state can be an object from volunteer ID to an array of shift IDs. Derive coverage from this single source of truth. When toggling, copy the inner array and the outer object.

## Example candidate answers

> I model state by volunteer because each row owns several selected shift IDs. I use IDs rather than labels because labels can change and IDs represent identity.

> I do not store coverage. It can always be calculated from availability, so another state value would risk becoming stale after a toggle.

> The functional update reads the latest state. It returns a new nested array for the selected volunteer and a new outer object while preserving unrelated arrays.

## Step-by-step solution

1. Create fixed volunteer and shift data.
2. Initialize an object of selected shift ID arrays.
3. Determine whether the clicked ID already exists.
4. Remove it with filter or append it with spread.
5. Return a new state object containing the new nested array.
6. Derive coverage with Object.fromEntries.
7. Derive uncovered shifts and the total selection count.
8. Render an accessible table and warning.

### Common mistakes

- Calling push on an array already stored in state.
- Copying only the outer object while mutating its nested array.
- Storing coverage and forgetting to update it.
- Using array positions as keys for identity-bearing rows and columns.

### Manual checks

- Remove Ben from Afternoon and confirm it becomes uncovered.
- Add Chloe to all shifts and confirm every count changes.
- Toggle the same cell twice and confirm state returns to its original value.
- Cover all shifts and confirm the warning disappears.

## Alternative approach

Store one array of volunteerId and shiftId pairs. It works well when availability records will be sent individually to an API. The object-of-arrays model provides simpler controlled checkbox lookup for this local interface.

## Full working code

Run npm ci, then npm run dev. The commented component is in [src/App.jsx](src/App.jsx).
