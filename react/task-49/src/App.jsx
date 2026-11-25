import { useState } from "react";

const initialMatches = [
  { id: 1, home: "Owls", away: "Foxes", homeScore: 1, awayScore: 1 },
  { id: 2, home: "Foxes", away: "Bears", homeScore: 2, awayScore: 0 },
  { id: 3, home: "Bears", away: "Owls", homeScore: 0, awayScore: 3 },
];

function buildStandings(matches) {
  const teams = new Map();

  const ensureTeam = (name) => {
    if (!teams.has(name)) teams.set(name, { name, played: 0, goalDifference: 0, points: 0 });
    return teams.get(name);
  };

  matches.forEach(({ home, away, homeScore, awayScore }) => {
    const homeTeam = ensureTeam(home);
    const awayTeam = ensureTeam(away);
    homeTeam.played += 1;
    awayTeam.played += 1;
    homeTeam.goalDifference += homeScore - awayScore;
    awayTeam.goalDifference += awayScore - homeScore;

    if (homeScore === awayScore) {
      homeTeam.points += 1;
      awayTeam.points += 1;
    } else if (homeScore > awayScore) {
      homeTeam.points += 3;
    } else {
      awayTeam.points += 3;
    }
  });

  // The table is derived from matches on every render; it is not duplicate state.
  return [...teams.values()].sort(
    (a, b) => b.points - a.points || b.goalDifference - a.goalDifference || a.name.localeCompare(b.name),
  );
}

export default function App() {
  const [matches, setMatches] = useState(initialMatches);
  const standings = buildStandings(matches);

  function updateScore(matchId, field, rawValue) {
    // Empty input becomes zero for this compact exercise; negatives are clamped to zero.
    const score = Math.max(0, Number(rawValue) || 0);
    setMatches((currentMatches) =>
      currentMatches.map((match) =>
        match.id === matchId ? { ...match, [field]: score } : match,
      ),
    );
  }

  return (
    <main>
      <h1>Community league</h1>
      <section aria-labelledby="scores-title">
        <h2 id="scores-title">Scores</h2>
        {matches.map((match) => (
          <p key={match.id}>
            {match.home} <input aria-label={`${match.home} score`} type="number" min="0" value={match.homeScore} onChange={(event) => updateScore(match.id, "homeScore", event.target.value)} />
            {" — "}
            <input aria-label={`${match.away} score`} type="number" min="0" value={match.awayScore} onChange={(event) => updateScore(match.id, "awayScore", event.target.value)} /> {match.away}
          </p>
        ))}
      </section>

      <h2>Standings</h2>
      <table><thead><tr><th>Team</th><th>Played</th><th>GD</th><th>Points</th></tr></thead><tbody>
        {standings.map((team) => <tr key={team.name}><td>{team.name}</td><td>{team.played}</td><td>{team.goalDifference}</td><td>{team.points}</td></tr>)}
      </tbody></table>
    </main>
  );
}
