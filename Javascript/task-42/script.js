const seats = [
  { id: "A1", isAvailable: true },
  { id: "A2", isAvailable: true },
  { id: "A3", isAvailable: false },
  { id: "A4", isAvailable: true },
  { id: "A5", isAvailable: true },
  { id: "A6", isAvailable: true },
  { id: "A7", isAvailable: false },
  { id: "A8", isAvailable: true },
];

// The function returns every valid adjacent block and does not change `seats`.
function findSeatBlocks(seatList, groupSize) {
  // Reject sizes that cannot represent a real group in this row.
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > seatList.length) {
    return [];
  }

  const blocks = [];

  // Stop where a full block can no longer fit in the remaining seats.
  for (let startIndex = 0; startIndex <= seatList.length - groupSize; startIndex += 1) {
    // `slice` creates a new candidate array without mutating the source row.
    const candidate = seatList.slice(startIndex, startIndex + groupSize);

    // A block is valid only when every seat inside it is available.
    const isAvailable = candidate.every((seat) => seat.isAvailable);

    if (isAvailable) {
      blocks.push(candidate.map((seat) => seat.id));
    }
  }

  return blocks;
}

function renderSeats(seatList) {
  const seatRow = document.querySelector("#seat-row");
  seatRow.innerHTML = "";

  seatList.forEach((seat) => {
    const seatElement = document.createElement("span");
    seatElement.textContent = `${seat.id} ${seat.isAvailable ? "available" : "booked"}`;
    seatElement.style.display = "inline-block";
    seatElement.style.margin = "0.25rem";
    seatElement.style.padding = "0.5rem";
    seatElement.style.background = seat.isAvailable ? "#b9f6ca" : "#ffcdd2";
    seatRow.append(seatElement);
  });
}

function showBlocks() {
  const input = document.querySelector("#group-size");
  const result = document.querySelector("#result");
  // Number converts the input string before the pure finder validates it.
  const groupSize = Number(input.value);

  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 4) {
    result.textContent = "Enter a whole group size from 1 to 4.";
    return;
  }

  const blocks = findSeatBlocks(seats, groupSize);

  result.textContent = blocks.length
    ? `Options: ${blocks.map((block) => block.join("–")).join(", ")}`
    : "No adjacent seats are available for this group.";
}

document.querySelector("#find-button").addEventListener("click", showBlocks);
renderSeats(seats);
showBlocks();

// These checks make the pure logic easy to verify outside the DOM.
console.assert(findSeatBlocks(seats, 2).length === 3, "Expected three two-seat blocks");
console.assert(findSeatBlocks(seats, 0).length === 0, "Invalid size must return no blocks");
