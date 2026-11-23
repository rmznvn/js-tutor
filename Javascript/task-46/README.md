# Task 46 — Independent reservation hold timers

**Difficulty:** Junior+  
**Main topic:** Closures and timers  
**Supporting topics:** Default parameters, callbacks, dates, remainder, private state, DOM events

## Scenario and requirements

A booking interface can temporarily hold several rooms. Build a reusable timer factory so every reservation owns an independent countdown.

### Done when

- createReservationTimer returns start, cancel, and getRemainingSeconds.
- Private intervalId and deadline variables cannot be changed from outside the factory.
- Starting an already running timer restarts it without creating a second interval.
- Remaining time is calculated from an absolute deadline to reduce interval drift.
- Expiry and cancellation call different callbacks.
- Two timers can run independently.

### Edge cases

- The same timer is started twice.
- Cancel is pressed when the timer is not running.
- A delayed interval fires after the deadline.

Estimated time: **45–60 minutes**.

## Interview hints: how to reason

Ask whether restarting should resume or replace the existing hold, whether cancellation resets the display, and whether several timers must coexist. Each factory call needs its own private mutable values, which makes a closure a natural choice.

Do not decrement a number blindly on every interval. Browser timers can be delayed. Store an absolute deadline and calculate the remaining seconds from deadline minus Date.now().

### Predict and explain

If createReservationTimer is called twice, do the two returned objects share intervalId? Explain using execution contexts and closures.

## Example candidate answers

> I use a factory because every reservation needs the same behavior with independent state. Each invocation creates a new lexical environment, so one timer cannot overwrite another timer’s interval ID.

> I calculate from a deadline instead of subtracting one every second. setInterval guarantees a minimum delay, not exact scheduling, so deadline-based calculation prevents accumulated drift.

> Before starting, I clear an existing interval. That makes restart behavior deterministic and prevents multiple callbacks from updating the same display.

## Step-by-step solution

1. Create a formatting helper using division, rounding, remainder, and padStart.
2. Keep intervalId and deadline inside the factory.
3. Create one helper that safely clears an active interval.
4. Derive remaining seconds from the current time and deadline.
5. On each tick, update the UI and expire at zero.
6. Restart by clearing the previous interval and creating a new deadline.
7. Connect independent timer instances to separate DOM sections.

### Common mistakes

- Keeping one global interval ID for all reservations.
- Creating another interval every time Start is pressed.
- Assuming a one-second interval executes at exact one-second boundaries.
- Calling the expiry callback repeatedly after reaching zero.

### Manual checks

- Start both holds and verify they count down independently.
- Restart one timer and verify the other does not reset.
- Cancel one timer and verify only its cancellation callback runs.
- Leave a timer running in a background tab and verify it still reaches zero.

## Alternative approach

A class can store intervalId and deadline as instance fields. It is useful when a codebase already models domain objects with classes. The closure factory exposes a smaller public API and demonstrates private lexical state without relying on class-private fields.

## Full working code

Open [index.html](index.html). The commented implementation is in [script.js](script.js).
