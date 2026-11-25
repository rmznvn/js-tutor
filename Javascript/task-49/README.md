# Task 49 — Media controller callback receiver

**Main topic:** `this`, regular functions, and `bind`  
**Supporting topics:** callbacks, object methods, remainder, array copying  
**Difficulty:** confident junior+

Create a podcast controller with Play/Pause and Next buttons. The player stores its own queue, current index, and playback state. Passing a method to `addEventListener` must not lose the player receiver.

## Ready when

- Toggle changes playback state and label.
- Next wraps from the last episode to the first.
- An empty playlist does not cause an error.
- You can explain why `player.next` used as a callback loses `this` and why `bind` fixes it.

## Interview thinking

I would say: “A regular method gets `this` from its call site. The event system calls the callback without `player.` in front of it, so I bind the method once and pass the bound function. An arrow method would capture lexical `this`, which is not the object literal, so it is not the right fix.”

## Debug checkpoint

Predict the result of `const next = player.next; next();`. In strict mode, `this` is `undefined`; in some browser contexts it may be another receiver, but it is never reliably the player.

## Alternative

Pass `() => player.next()` to the listener. It is concise and keeps the receiver via the explicit method call. A stored bound callback is preferable when you also need to remove the listener later.

The complete commented solution is in [script.js](script.js), and the full release explanation is in [../../releases/2026-11-25.md](../../releases/2026-11-25.md).
