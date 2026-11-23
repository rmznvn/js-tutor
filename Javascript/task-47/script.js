const rolePermissions = new Map([
  ["viewer", ["project:view", "comment:view"]],
  ["editor", ["project:view", "comment:view", "comment:create", "project:edit"]],
  ["manager", ["project:view", "comment:view", "project:edit", "member:invite"]],
]);

const users = [
  { id: 1, name: "Aisha", role: "viewer", customPermissions: ["comment:create"] },
  { id: 2, name: "Mateo", role: "editor", deniedPermissions: ["project:edit"] },
  { id: 3, name: "Noor", role: "manager", customPermissions: ["report:export"] },
  { id: 4, name: "Unknown role", role: "contractor" },
];

function sortWithoutMutation(values) {
  // toSorted is the modern non-mutating method; the fallback supports older targets.
  return typeof values.toSorted === "function"
    ? values.toSorted()
    : [...values].sort();
}

function getEffectivePermissions(user, permissionsByRole = rolePermissions) {
  const {
    role,
    customPermissions = [],
    deniedPermissions = [],
  } = user;

  // Unknown roles safely receive an empty permission array.
  const inheritedPermissions = permissionsByRole.get(role) ?? [];

  // Set removes duplicates while combining role and custom permissions.
  const effectivePermissions = new Set([
    ...inheritedPermissions,
    ...customPermissions,
  ]);

  // Explicit denials win over inherited and custom permissions.
  for (const permission of deniedPermissions) {
    effectivePermissions.delete(permission);
  }

  return sortWithoutMutation([...effectivePermissions]);
}

function renderUserOptions() {
  const select = document.querySelector("#user-select");

  users.forEach(({ id, name, role }) => {
    select.append(new Option(`${name} — ${role}`, String(id)));
  });
}

function renderPermissions(userId) {
  const user = users.find(({ id }) => id === Number(userId));
  const list = document.querySelector("#permission-list");
  const summary = document.querySelector("#summary");

  list.innerHTML = "";

  if (!user) {
    summary.textContent = "User not found.";
    return;
  }

  const permissions = getEffectivePermissions(user);

  permissions.forEach((permission) => {
    const item = document.createElement("li");
    item.textContent = permission;
    list.append(item);
  });

  summary.textContent = permissions.length
    ? `${permissions.length} effective permission(s).`
    : "This user has no effective permissions.";
}

document.querySelector("#user-select").addEventListener("change", (event) => {
  renderPermissions(event.target.value);
});

renderUserOptions();
renderPermissions(users.at(0).id);

console.assert(
  getEffectivePermissions(users[1]).includes("project:edit") === false,
  "Explicit denial must remove an inherited permission"
);
console.assert(
  getEffectivePermissions(users[3]).length === 0,
  "An unknown role must be handled safely"
);
