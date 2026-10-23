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

const form = document.getElementById("location-form");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const submitButton = document.getElementById("submit");
const statusElement = document.getElementById("status");
let selection = { countryId: "", cityId: "" };

// Создание option вынесено, чтобы не повторять одинаковые DOM-операции.
function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label; // Текст не интерпретируется как HTML.
  return option;
}

countries.forEach((country) => {
  countrySelect.append(createOption(country.id, country.name));
});

function getCities() {
  // Неизвестная или пустая страна даёт пустой список.
  return countries.find((country) => country.id === selection.countryId)?.cities ?? [];
}

function render() {
  const cities = getCities();
  countrySelect.value = selection.countryId;
  // Старые города удаляем перед выводом нового набора.
  citySelect.replaceChildren(createOption("",
    selection.countryId === "" ? "Сначала выберите страну" :
      cities.length === 0 ? "Города недоступны" : "Выберите город"
  ));
  cities.forEach((city) => citySelect.append(createOption(city.id, city.name)));
  citySelect.value = selection.cityId;
  citySelect.disabled = cities.length === 0;
  // Проверяем принадлежность города текущей стране, а не просто непустую строку.
  submitButton.disabled = !cities.some((city) => city.id === selection.cityId);
}

countrySelect.addEventListener("change", (event) => {
  // Страна и сброс города — одно изменение; старый город больше не подходит.
  selection = { countryId: event.target.value, cityId: "" };
  statusElement.textContent = "";
  render();
});

citySelect.addEventListener("change", (event) => {
  selection = { ...selection, cityId: event.target.value };
  statusElement.textContent = "";
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = getCities().find((item) => item.id === selection.cityId);
  if (!city) return; // Защита обработчика независимо от disabled.
  const country = countries.find((item) => item.id === selection.countryId);
  statusElement.textContent = "Выбрано: " + country.name + ", " + city.name +
    ". Учебная форма, запрос на сервер не выполнялся.";
});
render();
