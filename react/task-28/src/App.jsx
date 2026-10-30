import { useState } from "react";

// Чистая функция общая для двух подходов:
// принимает строки и возвращает сообщение либо пустую строку.
function validateAddress(method, address) {
  // Адрес нужен только курьеру. Пробелы не считаются адресом.
  if (method === "courier" && address.trim().length < 5) {
    return "Введите адрес: минимум 5 символов без пробелов по краям.";
  }
  return "";
}

export default function DeliveryForm() {
  const [method, setMethod] = useState("pickup");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState("");

  const isCourier = method === "courier";
  // Сообщение выводится из данных; отдельный state ошибки не нужен.
  const error = submitted ? validateAddress(method, address) : "";

  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    // setSubmitted не меняет переменные этого рендера.
    // Проверяем функцию напрямую, а не читаем старую error.
    const message = validateAddress(method, address);
    if (message) {
      setResult("");
      return;
    }

    // Черновик адреса сохраняется в state, но при самовывозе
    // в подготовленные данные не включается.
    const payload = isCourier
      ? { method, address: address.trim() }
      : { method };
    setResult("Проверено локально: " + JSON.stringify(payload));
  }

  return (
    <main>
      <h1>Получение заказа</h1>
      {/* Правило проверки реализовано в JS, встроенную проверку отключаем. */}
      <form noValidate onSubmit={submit}>
        <label>
          Способ получения
          <select
            value={method}
            onChange={(event) => {
              setMethod(event.target.value);
              setSubmitted(false);
              setResult(""); // Старое подтверждение больше не актуально.
            }}
          >
            <option value="pickup">Самовывоз</option>
            <option value="courier">Курьер</option>
          </select>
        </label>

        {isCourier && (
          <label>
            Адрес доставки
            <input
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setResult("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby="address-error"
            />
          </label>
        )}
        {/* Область ошибки остаётся в DOM, даже если сообщения нет. */}
        <p id="address-error" role="alert">{error}</p>
        <button type="submit">Проверить заказ</button>
        <p role="status">{result}</p>
      </form>
    </main>
  );
}
