const subscriptions = [
  { id: 1, service: "Design Cloud", renewalDate: "2026-11-25", price: 19.99 },
  { id: 2, service: "Team Chat", renewalDate: "2026-11-28", price: 8 },
  { id: 3, service: "Archive Pro", renewalDate: "2026-11-20", price: 12.5 },
  { id: 4, service: "Broken record", renewalDate: "not-a-date", price: 10 },
];

// One calendar day in milliseconds. Named constants make date arithmetic readable.
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Converting an ISO date to UTC midnight avoids daylight-saving-hour surprises.
function parseIsoDateAtUtcMidnight(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Date normalizes impossible dates, so compare the parts to reject 2026-02-31.
  const isExactDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isExactDate ? date : null;
}

function prepareRenewalNotices(items, todayIso, locale = "en-GB", currency = "EUR") {
  const today = parseIsoDateAtUtcMidnight(todayIso);
  if (!today) throw new Error("todayIso must be a valid YYYY-MM-DD date");

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const moneyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return items
    .map((item) => {
      const renewalDate = parseIsoDateAtUtcMidnight(item.renewalDate);
      const numericPrice = Number(item.price);

      // Invalid records remain visible so the interface can explain the problem.
      if (!renewalDate || !Number.isFinite(numericPrice) || numericPrice < 0) {
        return { ...item, status: "invalid", daysUntil: null, message: "Check subscription data" };
      }

      const daysUntil = Math.round((renewalDate - today) / DAY_IN_MS);
      const status = daysUntil < 0 ? "expired" : daysUntil === 0 ? "today" : "upcoming";
      const timing =
        daysUntil < 0
          ? `${Math.abs(daysUntil)} day(s) overdue`
          : daysUntil === 0
            ? "renews today"
            : `renews in ${daysUntil} day(s)`;

      return {
        ...item,
        status,
        daysUntil,
        message: `${dateFormatter.format(renewalDate)} · ${timing} · ${moneyFormatter.format(numericPrice)}`,
      };
    })
    // Copying before sort protects the mapped result if this comparator is reused elsewhere.
    .toSorted((a, b) => {
      if (a.status === "invalid") return 1;
      if (b.status === "invalid") return -1;
      return a.daysUntil - b.daysUntil;
    });
}

function renderRenewals(notices, container) {
  container.replaceChildren();
  notices.forEach((notice) => {
    const item = document.createElement("li");
    item.textContent = `${notice.service}: ${notice.message}`;
    item.dataset.status = notice.status;
    container.append(item);
  });
}

const notices = prepareRenewalNotices(subscriptions, "2026-11-25");
renderRenewals(notices, document.querySelector("#renewal-list"));

// Manual checkpoints: invalid last, overdue first, today's renewal next.
console.table(notices);
