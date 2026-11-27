const initialStock = [
  { id: "camera", name: "Camera", available: 3 },
  { id: "tripod", name: "Tripod", available: 5 },
  { id: "mic", name: "Microphone", available: 2 },
];

function createInventoryLedger(items = []) {
  // The Map is reachable only through the returned methods: the closure protects it.
  const stock = new Map(
    items.map(({ id, name, available }) => [id, { name, available }]),
  );

  function change(productId, rawQuantity, direction) {
    const quantity = Number(rawQuantity);
    const product = stock.get(productId);

    if (!product) return { ok: false, message: "Unknown product." };
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { ok: false, message: "Quantity must be a positive integer." };
    }
    if (direction === -1 && quantity > product.available) {
      return { ok: false, message: `Only ${product.available} available.` };
    }

    // Replace the value object instead of mutating the existing object in the Map.
    const nextAvailable = product.available + direction * quantity;
    stock.set(productId, { ...product, available: nextAvailable });

    return {
      ok: true,
      message: direction === -1 ? `Reserved ${quantity}.` : `Released ${quantity}.`,
    };
  }

  return {
    reserve(productId, quantity) {
      return change(productId, quantity, -1);
    },
    release(productId, quantity) {
      return change(productId, quantity, 1);
    },
    getSnapshot() {
      // Return fresh objects so callers cannot mutate the private Map values.
      return [...stock].map(([id, product]) => ({ id, ...product }));
    },
  };
}

const ledger = createInventoryLedger(initialStock);
const form = document.querySelector("#inventory-form");
const productSelect = document.querySelector("#product");
const quantityInput = document.querySelector("#quantity");
const message = document.querySelector("#message");
const stockList = document.querySelector("#stock-list");

function render() {
  const snapshot = ledger.getSnapshot();
  stockList.replaceChildren();
  productSelect.replaceChildren();

  snapshot.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.append(option);

    const item = document.createElement("li");
    item.textContent = `${product.name}: ${product.available} available`;
    stockList.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const action = event.submitter?.value;
  const method = action === "release" ? "release" : "reserve";
  const result = ledger[method](productSelect.value, quantityInput.value);
  message.textContent = result.message;
  if (result.ok) render();
});

render();

// Explain-why checkpoint: changing initialStock later cannot reach the private Map,
// and changing an object returned by getSnapshot cannot change the ledger either.
