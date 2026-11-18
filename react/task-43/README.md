# Task 43 — Audio queue with safe current-track removal

## Scenario and requirements

Build an audio queue UI. No real audio API is required. A user can choose a track, move to the previous or next track, and remove any track.

### Done when

- The current track is identified by a stable ID.
- Previous and Next wrap around at the ends.
- Removing a non-current track preserves the current track.
- Removing the current track selects the next remaining track, or the previous one when the removed track was last.
- Removing the final track produces an empty state without errors.

### Edge cases

- The first or last track is current when navigation is clicked.
- The current last track is removed.
- The only remaining track is removed.

Estimated time: **45–60 minutes**.

## Interview hints: how to reason

Ask the interviewer:

1. Should navigation stop or wrap at the queue boundaries?
2. Which track becomes current when the active track is removed?
3. Should the current selection use an array index or an ID?

Store only the mutable queue and `currentTrackId`. Derive the current index and current object during render. An index is unsafe as the identity because deleting an earlier item changes later indices.

Use a functional state update for removal because the next queue depends on the previous queue. Compute the fallback before returning that next queue.

## Example candidate answers

> I will store the selected track ID instead of the selected index. IDs represent identity, while an index only represents the current position and changes after deletion.

> The current object and index can be derived with `findIndex`, so I will not create extra state for them. That avoids keeping three values synchronized.

> For removal I will use `filter` because it returns a new array. If the removed item is current, I will select the item that moves into its old position. `Math.min` handles the removed-last-item case. I will explicitly handle an empty queue before reading an ID.

## Step-by-step solution

1. Initialize `tracks` and `currentTrackId`.
2. Derive `currentIndex` and `currentTrack` during render.
3. For navigation, calculate a wrapped index with modulo.
4. For removal, find the removed position and create `nextTracks` with `filter`.
5. Preserve the ID if a different track was removed.
6. If the current track was removed, choose a valid fallback or `null`.
7. Render a clear empty state and disable navigation by not rendering its controls.

### Common mistakes

- Using an array index as both `key` and selected identity.
- Mutating the queue with `splice`.
- Reading `nextTracks[removedIndex]` after deleting the last track without a boundary check.
- Storing the entire current object and letting it become stale.

### Manual checks

- From the last track, Next selects the first.
- Removing the second track while the fourth is current keeps the fourth current.
- Removing the current middle track selects the following track.
- Removing every track shows “The queue is empty.”

## Alternative approach

Keep `currentIndex` in state. Navigation becomes slightly shorter, but every insertion and deletion before that index requires correcting it. This is acceptable for a fixed array, while a stable ID is safer for an editable queue.

## Full working code

Run `npm ci`, then `npm run dev`. The complete commented component is in [src/App.jsx](src/App.jsx).
