import { useState } from "react";

const initialPeople = [
  { id: 1, name: "Ava", paid: "48.00" },
  { id: 2, name: "Noah", paid: "12.00" },
  { id: 3, name: "Mia", paid: "0" },
];

function calculateSettlement(people) {
  const parsed = people.map((person) => {
    const amount = Number(person.paid);
    const isValid = Number.isFinite(amount) && amount >= 0;
    return { ...person, isValid, paidCents: isValid ? Math.round(amount * 100) : 0 };
  });

  if (parsed.some((person) => !person.isValid)) {
    return { valid: false, totalCents: 0, balances: [] };
  }

  const totalCents = parsed.reduce((sum, person) => sum + person.paidCents, 0);
  const baseShare = Math.floor(totalCents / parsed.length);
  const extraCents = totalCents % parsed.length;

  const balances = parsed.map((person, index) => {
    // Distribute leftover cents so target shares add to the exact total.
    const targetCents = baseShare + (index < extraCents ? 1 : 0);
    return { ...person, targetCents, balanceCents: person.paidCents - targetCents };
  });

  return { valid: true, totalCents, balances };
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
});

export default function App() {
  const [people, setPeople] = useState(initialPeople);
  const settlement = calculateSettlement(people);

  function updatePaid(personId, paid) {
    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === personId ? { ...person, paid } : person,
      ),
    );
  }

  return (
    <main>
      <h1>Shared dinner bill</h1>
      {people.map((person) => (
        <label key={person.id}>
          {person.name}
          <input type="number" min="0" step="0.01" value={person.paid}
            onChange={(event) => updatePaid(person.id, event.target.value)} />
        </label>
      ))}

      {!settlement.valid ? (
        <p role="alert">Every payment must be a non-negative number.</p>
      ) : (
        <>
          <p>Total: {money.format(settlement.totalCents / 100)}</p>
          <ul>
            {settlement.balances.map((person) => (
              <li key={person.id}>
                {person.name}:{" "}
                {person.balanceCents === 0
                  ? "settled"
                  : person.balanceCents > 0
                    ? "should receive " + money.format(person.balanceCents / 100)
                    : "owes " + money.format(Math.abs(person.balanceCents) / 100)}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
