import { useState } from "react";

const matches = {
  semi1: ["Ava", "Ben"],
  semi2: ["Chloe", "Diego"],
};

export default function App() {
  const [semi1Winner, setSemi1Winner] = useState("");
  const [semi2Winner, setSemi2Winner] = useState("");
  const [champion, setChampion] = useState("");

  // Finalists are derived from semifinal state and do not need their own state.
  const finalists = [semi1Winner, semi2Winner].filter(Boolean);

  function changeSemifinal(field, nextWinner) {
    // Update the requested semifinal while keeping the handler reusable.
    if (field === "semi1") {
      setSemi1Winner(nextWinner);
    } else {
      setSemi2Winner(nextWinner);
    }

    // Calculate the finalists after this specific change before React renders again.
    const nextFinalists = field === "semi1"
      ? [nextWinner, semi2Winner].filter(Boolean)
      : [semi1Winner, nextWinner].filter(Boolean);

    // Reset a champion that no longer belongs to the final.
    if (!nextFinalists.includes(champion)) {
      setChampion("");
    }
  }

  return (
    <main>
      <h1>Four-player tournament</h1>

      <label>
        Semifinal 1 winner
        <select
          value={semi1Winner}
          onChange={(event) => changeSemifinal("semi1", event.target.value)}
        >
          <option value="">Choose winner</option>
          {matches.semi1.map((player) => <option key={player}>{player}</option>)}
        </select>
      </label>

      <label>
        Semifinal 2 winner
        <select
          value={semi2Winner}
          onChange={(event) => changeSemifinal("semi2", event.target.value)}
        >
          <option value="">Choose winner</option>
          {matches.semi2.map((player) => <option key={player}>{player}</option>)}
        </select>
      </label>

      <label>
        Champion
        <select
          value={champion}
          disabled={finalists.length < 2}
          onChange={(event) => setChampion(event.target.value)}
        >
          <option value="">Choose champion</option>
          {finalists.map((player) => <option key={player}>{player}</option>)}
        </select>
      </label>

      <p aria-live="polite">
        {champion ? `Champion: ${champion}` : "Choose both semifinal winners, then choose the champion."}
      </p>
    </main>
  );
}
