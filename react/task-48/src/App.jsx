import { useState } from "react";

const volunteers = [
  { id: "ava", name: "Ava" },
  { id: "ben", name: "Ben" },
  { id: "chloe", name: "Chloe" },
];

const shifts = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

const initialAvailability = {
  ava: ["morning"],
  ben: ["afternoon"],
  chloe: [],
};

export default function App() {
  // Each object property contains the shift IDs selected by one volunteer.
  const [availability, setAvailability] = useState(initialAvailability);

  function toggleAvailability(volunteerId, shiftId) {
    setAvailability((currentAvailability) => {
      const currentShifts = currentAvailability[volunteerId] ?? [];
      const isSelected = currentShifts.includes(shiftId);

      // Create both a new nested array and a new outer object.
      const nextShifts = isSelected
        ? currentShifts.filter((id) => id !== shiftId)
        : [...currentShifts, shiftId];

      return {
        ...currentAvailability,
        [volunteerId]: nextShifts,
      };
    });
  }

  // Coverage is derived, so no second state value can drift out of sync.
  const coverage = Object.fromEntries(
    shifts.map((shift) => [
      shift.id,
      volunteers.filter((volunteer) =>
        (availability[volunteer.id] ?? []).includes(shift.id)
      ).length,
    ])
  );

  const uncoveredShifts = shifts.filter((shift) => coverage[shift.id] === 0);
  const totalSelections = Object.values(availability).reduce(
    (total, selectedShifts) => total + selectedShifts.length,
    0
  );

  return (
    <main>
      <h1>Volunteer availability matrix</h1>

      <table>
        <thead>
          <tr>
            <th scope="col">Volunteer</th>
            {shifts.map((shift) => (
              <th scope="col" key={shift.id}>{shift.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <th scope="row">{volunteer.name}</th>
              {shifts.map((shift) => {
                const isChecked = (availability[volunteer.id] ?? [])
                  .includes(shift.id);

                return (
                  <td key={shift.id}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      aria-label={`${volunteer.name} is available for ${shift.label}`}
                      onChange={() => toggleAvailability(volunteer.id, shift.id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Coverage</h2>
      <ul>
        {shifts.map((shift) => (
          <li key={shift.id}>
            {shift.label}: {coverage[shift.id]} volunteer(s)
          </li>
        ))}
      </ul>

      <p>{totalSelections} availability selection(s) in total.</p>

      {uncoveredShifts.length > 0 && (
        <p role="alert">
          No coverage: {uncoveredShifts.map(({ label }) => label).join(", ")}.
        </p>
      )}
    </main>
  );
}
