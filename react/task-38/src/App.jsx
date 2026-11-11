import { useState } from "react";

export default function LinkedAddresses() {
  const [shipping, setShipping] = useState("Москва, Лесная 1");
  const [billingDraft, setBillingDraft] = useState("Казань, Мира 2");
  const [sameAddress, setSameAddress] = useState(false);

  // Это производное значение. useEffect для синхронизации не требуется.
  // billingDraft сохраняется даже в режиме совпадающих адресов.
  const effectiveBilling = sameAddress ? shipping : billingDraft;

  return (
    <main>
      <h1>Адреса заказа</h1>
      <label htmlFor="shipping">Адрес доставки</label>
      <input
        id="shipping"
        value={shipping}
        onChange={(event) => setShipping(event.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={sameAddress}
          // Меняем только boolean; черновик отдельного адреса сохраняется.
          onChange={(event) => setSameAddress(event.target.checked)}
        />
        Адрес оплаты совпадает с доставкой
      </label>

      <label htmlFor="billing">Адрес оплаты</label>
      <input
        id="billing"
        value={effectiveBilling}
        disabled={sameAddress}
        aria-describedby="billing-hint"
        onChange={(event) => setBillingDraft(event.target.value)}
      />
      <p id="billing-hint">
        {sameAddress
          ? "Используется адрес доставки. Снимите отметку для отдельного адреса."
          : "Можно указать отдельный адрес оплаты."}
      </p>
      {/* И поле, и сводка используют одно вычисленное значение. */}
      <p>Доставка: {shipping}. Оплата: {effectiveBilling}</p>
    </main>
  );
}
