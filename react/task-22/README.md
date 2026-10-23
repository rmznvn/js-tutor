# Зависимые списки «Страна → Город» — React

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

Другая версия: [JavaScript](../../Javascript/task-21/README.md).

## Запуск

Из папки задачи: `npm ci`, затем `npm run dev`. Для Codespaces: `npm run dev -- --host 0.0.0.0`, затем Open in Browser. Сборка: `npm run build`.

## Полный код с комментариями

<details>
<summary>Показать решение</summary>

### src/components/LocationForm.jsx

```jsx
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

```

</details>
