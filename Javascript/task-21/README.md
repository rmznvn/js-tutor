# Зависимые списки «Страна → Город» — JavaScript

Выпуск **2026-10-23**. Время: 35–45 минут на обе версии.

## Условие

В форме регистрации города зависят от страны. После смены страны старый город обязательно сбрасывается.

### Входные данные и критерии готовности

- Россия: Москва, Казань. Узбекистан: Ташкент, Самарканд. Другая страна: пустой список.
- Сначала выбрана пустая страна, город и отправка disabled.
- После выбора страны показываются только её города.
- Изменение страны сбрасывает город, даже если новый список не пуст.
- Подтверждение доступно только при принадлежности города текущей стране; сообщение очищается при редактировании.
- Учебное подтверждение без запроса на сервер. React не использует useEffect/useRef.

### Крайние случаи

- Россия/Москва → Узбекистан: город пустой.
- Сброс страны на placeholder.
- Другая страна без городов: город и отправка disabled.

## Как рассуждать

- Когда сбрасывать город?
- Какие значения хранить?
- Почему недостаточно проверить cityId !== ''?

Начни с источника данных и результата одного действия. Отдели состояние от вычисляемых значений. Предскажи результат на маленьком примере до выбора метода.

## Примеры ответов вслух

> «В том же обработчике смены страны. Причина известна, поэтому эффект не нужен. Одним обновлением запишу новую страну и пустой город.»

> «Храню countryId и cityId, а страну, список городов и валидность вычисляю через find и optional chaining с ?? [].»

> «Непустой ID может принадлежать прежней стране. Проверю наличие ID среди текущих cities. В JS после изменения вызову render, в React setter приведёт к новому JSX.»

## Пошаговый разбор

1. Подготовить страны с вложенными массивами городов.
2. Получить текущую страну и её cities.
3. Смену страны и очистку города выполнить вместе.
4. Вывести placeholder и только доступные option.
5. Связать disabled с наличием списка и допустимого города.
6. Повторно защитить submit и вывести учебное подтверждение.

## Типичные ошибки

- Оставлять старый cityId после смены страны.
- Хранить cities отдельно и забывать синхронизацию.
- Обращаться к undefined.cities при пустом выборе.
- Сбрасывать город в useEffect, когда это можно сделать в событии.

## Альтернативный способ

В React вынести выбор города в компонент с key={countryId}, чтобы смена страны сбрасывала локальное состояние. Это подходит автономному редактору города; родительской форме проще владеть обоими ID и обновлять их вместе.

## Ручная проверка

Выбери Россия/Москва и подтверди. Переключи Узбекистан: сообщение исчезло, город сброшен. Выбери Ташкент и подтверди. Проверь placeholder и страну без городов.

Другая версия: [React](../../react/task-22/README.md).

## Запуск

Открой index.html. Для чистой функции смотри DevTools → Console.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### script.js

```js
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

```

### index.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JS</title><style>body{font-family:system-ui;max-width:50rem;margin:auto;padding:2rem}label{display:block;margin-top:1rem}input,select,button{font:inherit;margin:.3rem}[hidden]{display:none!important}</style></head><body><main><h1>Выбор города</h1><form id="location-form"><label for="country">Страна</label><select id="country"><option value="">Выберите страну</option></select><label for="city">Город</label><select id="city" disabled><option value="">Сначала выберите страну</option></select><button id="submit" type="submit" disabled>Подтвердить</button><p id="status" role="status"></p></form></main><script src="./script.js"></script></body></html>

```

</details>
