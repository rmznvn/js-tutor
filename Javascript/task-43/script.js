const matches = {
  semi1: ["Ava", "Ben"],
  semi2: ["Chloe", "Diego"],
};

const state = {
  semi1Winner: "",
  semi2Winner: "",
  champion: "",
};

function getFinalists(bracketState) {
  // Empty semifinal winners are removed, so the final only shows valid players.
  return [bracketState.semi1Winner, bracketState.semi2Winner].filter(Boolean);
}

function updateSemifinal(bracketState, field, winner) {
  // Spread creates a new state object instead of changing the existing object.
  const nextState = { ...bracketState, [field]: winner };
  const finalists = getFinalists(nextState);

  // A former champion becomes invalid when their semifinal winner changes.
  if (!finalists.includes(nextState.champion)) {
    nextState.champion = "";
  }

  return nextState;
}

function fillSelect(select, options, placeholder) {
  select.innerHTML = "";
  const emptyOption = new Option(placeholder, "");
  select.append(emptyOption);

  options.forEach((value) => select.append(new Option(value, value)));
}

function render(bracketState) {
  const semi1Select = document.querySelector("#semi-1");
  const semi2Select = document.querySelector("#semi-2");
  const finalSelect = document.querySelector("#final");
  const summary = document.querySelector("#summary");

  fillSelect(semi1Select, matches.semi1, "Choose winner");
  fillSelect(semi2Select, matches.semi2, "Choose winner");
  fillSelect(finalSelect, getFinalists(bracketState), "Choose champion");

  semi1Select.value = bracketState.semi1Winner;
  semi2Select.value = bracketState.semi2Winner;
  finalSelect.value = bracketState.champion;
  finalSelect.disabled = getFinalists(bracketState).length < 2;

  summary.textContent = bracketState.champion
    ? `Champion: ${bracketState.champion}`
    : "Choose both semifinal winners, then choose the champion.";
}

function handleSemifinal(field, winner) {
  const nextState = updateSemifinal(state, field, winner);
  Object.assign(state, nextState);
  render(state);
}

document.querySelector("#semi-1").addEventListener("change", (event) => {
  handleSemifinal("semi1Winner", event.target.value);
});

document.querySelector("#semi-2").addEventListener("change", (event) => {
  handleSemifinal("semi2Winner", event.target.value);
});

document.querySelector("#final").addEventListener("change", (event) => {
  state.champion = event.target.value;
  render(state);
});

render(state);
