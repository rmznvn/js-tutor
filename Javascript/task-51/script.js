const audits = [
  { page: "/checkout", sections: [
    { name: "Form", issues: [
      { id: "a1", type: "label", severity: "high", resolved: false },
      { id: "a2", type: "contrast", severity: "medium", resolved: true },
    ] },
  ] },
  { page: "/account", sections: [
    { name: "Navigation", issues: [
      { id: "a3", type: "keyboard", severity: "high", resolved: false },
      { id: "a4", type: "label", severity: "low", resolved: false },
    ] },
    { name: "Profile", issues: [] },
  ] },
];

function prepareAuditQueue(pageAudits) {
  const severityRank = new Map([["high", 0], ["medium", 1], ["low", 2]]);

  const unresolved = pageAudits
    .flatMap(({ page, sections = [] }) =>
      sections.flatMap(({ name: section, issues = [] }) =>
        issues.map((issue) => ({ ...issue, page, section })),
      ),
    )
    .filter((issue) => !issue.resolved);

  const types = new Set(unresolved.map((issue) => issue.type));
  const countsBySeverity = new Map();

  unresolved.forEach(({ severity }) => {
    countsBySeverity.set(severity, (countsBySeverity.get(severity) ?? 0) + 1);
  });

  const sortedIssues = [...unresolved].sort(
    (a, b) =>
      (severityRank.get(a.severity) ?? Infinity) -
        (severityRank.get(b.severity) ?? Infinity) ||
      a.page.localeCompare(b.page),
  );

  return { issues: sortedIssues, uniqueTypes: [...types].sort(), countsBySeverity };
}

function renderAudit(result) {
  const summary = document.querySelector("#summary");
  const list = document.querySelector("#issues");
  const counts = [...result.countsBySeverity]
    .map(([severity, count]) => `${severity}: ${count}`)
    .join(", ");

  summary.textContent = `${result.issues.length} open · Types: ${result.uniqueTypes.join(", ") || "none"} · ${counts || "No severity counts"}`;
  list.replaceChildren();

  result.issues.forEach((issue) => {
    const item = document.createElement("li");
    item.textContent = `[${issue.severity}] ${issue.page} / ${issue.section}: ${issue.type}`;
    list.append(item);
  });
}

renderAudit(prepareAuditQueue(audits));

// Debug checkpoint: flatMap removes one nesting level per call; the two calls
// turn pages → sections → issues into one issue array without mutating audits.
