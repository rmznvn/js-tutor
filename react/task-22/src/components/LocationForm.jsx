import { useState } from "react";

const countries = [
  { id: "ru", name: "Россия", cities: [
    { id: "moscow", name: "Москва" },
    { id: "kazan", name: "Казань" },
  ] },
  { id: "uz", name: "Узбекистан", cities: [
    { id: "tashkent", name: "Ташкент" },
    { id: "samarkand", name: "Самарканд" },
  ] },
  { id: "other", name: "Другая страна", cities: [] },
];

export default function LocationForm() {
  const [selection, setSelection] = useState({ countryId: "", cityId: "" });
  const [message, setMessage] = useState("");
  // Объект страны, доступные города и валидность — производные значения.
  const country = countries.find((item) => item.id === selection.countryId);
  const cities = country?.cities ?? [];
  const city = cities.find((item) => item.id === selection.cityId);

  function changeCountry(event) {
    // Одним setter меняем родительский выбор и сбрасываем зависимый.
    // useEffect для этого не нужен: причина изменения известна в событии.
    setSelection({ countryId: event.target.value, cityId: "" });
    setMessage("");
  }

  function changeCity(event) {
    const cityId = event.target.value;
    // Сохраняем страну и неизменяемо обновляем город.
    setSelection((current) => ({ ...current, cityId }));
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();
    if (!country || !city) return;
    setMessage("Выбрано: " + country.name + ", " + city.name +
      ". Учебная форма, запрос на сервер не выполнялся.");
  }

  return (
    <main>
      <h1>Выбор города</h1>
      <form onSubmit={submit}>
        <label htmlFor="country">Страна</label>
        <select id="country" value={selection.countryId} onChange={changeCountry}>
          <option value="">Выберите страну</option>
          {countries.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <label htmlFor="city">Город</label>
        <select id="city" value={selection.cityId} onChange={changeCity}
          disabled={cities.length === 0}>
          <option value="">
            {selection.countryId === "" ? "Сначала выберите страну" :
              cities.length === 0 ? "Города недоступны" : "Выберите город"}
          </option>
          {cities.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        {/* city — объект найденного города или undefined. */}
        <button type="submit" disabled={!city}>Подтвердить</button>
        <p role="status">{message}</p>
      </form>
    </main>
  );
}
