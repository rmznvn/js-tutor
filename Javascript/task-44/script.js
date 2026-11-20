const commands = [
  { id: "new-note", label: "Create a note", keywords: ["add", "write"] },
  { id: "invite", label: "Invite a teammate", keywords: ["member", "email"] },
  { id: "export", label: "Export report", keywords: ["download", "csv"] },
  { id: "settings", label: "Open settings", keywords: ["preferences", "account"] },
  { id: "archive", label: "View archive", keywords: ["deleted", "old"] },
];

const paletteState = {
  isOpen: false,
  query: "",
  activeIndex: 0,
};

function filterCommands(commandList, query) {
  // Normalization makes matching independent of case and surrounding spaces.
  const normalizedQuery = query.trim().toLowerCase();

  // An empty search intentionally returns a new array with every command.
  if (!normalizedQuery) return [...commandList];

  return commandList.filter((command) => {
    // Search a single normalized string containing both the label and keywords.
    const searchableText = [command.label, ...command.keywords]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

function getVisibleCommands() {
  return filterCommands(commands, paletteState.query);
}

function renderPalette() {
  const palette = document.querySelector("#palette");
  const input = document.querySelector("#command-search");
  const list = document.querySelector("#command-list");
  const visibleCommands = getVisibleCommands();

  palette.hidden = !paletteState.isOpen;
  input.value = paletteState.query;
  list.innerHTML = "";

  // No active option exists when the filter returns an empty array.
  if (visibleCommands.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No commands found.";
    list.append(emptyItem);
    input.setAttribute("aria-activedescendant", "");
    return;
  }

  visibleCommands.forEach((command, index) => {
    const item = document.createElement("li");
    item.id = `command-${command.id}`;
    item.dataset.commandId = command.id;
    item.role = "option";
    item.textContent = command.label;
    item.setAttribute("aria-selected", String(index === paletteState.activeIndex));
    item.style.background = index === paletteState.activeIndex ? "#dbeafe" : "transparent";
    item.style.padding = "0.5rem";
    list.append(item);
  });

  input.setAttribute(
    "aria-activedescendant",
    `command-${visibleCommands[paletteState.activeIndex].id}`
  );
}

function openPalette() {
  paletteState.isOpen = true;
  paletteState.query = "";
  paletteState.activeIndex = 0;
  renderPalette();
  document.querySelector("#command-search").focus();
}

function closePalette() {
  paletteState.isOpen = false;
  renderPalette();
  // Return focus to the control that opened the temporary interface.
  document.querySelector("#open-palette").focus();
}

function executeCommand(command) {
  document.querySelector("#status").textContent = `Executed: ${command.label}`;
  closePalette();
}

function moveActiveIndex(direction) {
  const visibleCommands = getVisibleCommands();
  if (visibleCommands.length === 0) return;

  // Adding the length keeps the result positive when moving above index zero.
  paletteState.activeIndex =
    (paletteState.activeIndex + direction + visibleCommands.length) %
    visibleCommands.length;

  renderPalette();
}

document.querySelector("#open-palette").addEventListener("click", openPalette);

document.querySelector("#command-search").addEventListener("input", (event) => {
  paletteState.query = event.target.value;
  // A new result list starts from its first item.
  paletteState.activeIndex = 0;
  renderPalette();
});

document.querySelector("#command-search").addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveActiveIndex(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveActiveIndex(-1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    const command = getVisibleCommands()[paletteState.activeIndex];
    if (command) executeCommand(command);
  } else if (event.key === "Escape") {
    closePalette();
  }
});

document.querySelector("#command-list").addEventListener("click", (event) => {
  const item = event.target.closest("[data-command-id]");
  if (!item) return;

  const command = commands.find(({ id }) => id === item.dataset.commandId);
  if (command) executeCommand(command);
});

renderPalette();
