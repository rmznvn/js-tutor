function formatTime(totalSeconds) {
  // Clamp invalid negative time so an expired timer always renders as 00:00.
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createReservationTimer({
  durationSeconds = 60,
  onTick = () => {},
  onExpire = () => {},
  onCancel = () => {},
}) {
  // These variables remain private inside the closure of this timer instance.
  let intervalId = null;
  let deadline = null;

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function getRemainingSeconds() {
    if (deadline === null) return durationSeconds;

    // Calculate from an absolute deadline so delayed intervals do not accumulate drift.
    return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  }

  function tick() {
    const remainingSeconds = getRemainingSeconds();
    onTick(remainingSeconds);

    if (remainingSeconds === 0) {
      stopInterval();
      deadline = null;
      onExpire();
    }
  }

  function start() {
    // Restarting replaces the previous interval instead of creating a second one.
    stopInterval();
    deadline = Date.now() + durationSeconds * 1000;
    onTick(durationSeconds);
    intervalId = setInterval(tick, 250);
  }

  function cancel() {
    const wasRunning = intervalId !== null;
    stopInterval();
    deadline = null;
    onTick(durationSeconds);

    if (wasRunning) onCancel();
  }

  return {
    start,
    cancel,
    getRemainingSeconds,
  };
}

function connectTimer({ durationSeconds, timeSelector, startSelector, cancelSelector, label }) {
  const timeElement = document.querySelector(timeSelector);
  const statusElement = document.querySelector("#status");

  const timer = createReservationTimer({
    durationSeconds,
    onTick: (seconds) => {
      timeElement.textContent = formatTime(seconds);
    },
    onExpire: () => {
      statusElement.textContent = `${label} hold expired.`;
    },
    onCancel: () => {
      statusElement.textContent = `${label} hold cancelled.`;
    },
  });

  document.querySelector(startSelector).addEventListener("click", () => {
    timer.start();
    statusElement.textContent = `${label} hold started.`;
  });

  document.querySelector(cancelSelector).addEventListener("click", timer.cancel);
  timeElement.textContent = formatTime(durationSeconds);

  return timer;
}

// Each call creates an independent closure with its own interval and deadline.
connectTimer({
  durationSeconds: 10,
  timeSelector: "#studio-time",
  startSelector: "#studio-start",
  cancelSelector: "#studio-cancel",
  label: "Studio room",
});

connectTimer({
  durationSeconds: 15,
  timeSelector: "#workshop-time",
  startSelector: "#workshop-start",
  cancelSelector: "#workshop-cancel",
  label: "Workshop room",
});

console.assert(formatTime(65) === "01:05", "65 seconds must format as 01:05");
console.assert(formatTime(-3) === "00:00", "Negative time must be clamped");
