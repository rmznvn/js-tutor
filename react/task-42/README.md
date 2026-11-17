# JavaScript → React: удаляемые чипы фильтров

Выпуск за понедельник 16 ноября 2026. Добавлен 17 ноября как пропущенный выпуск. Уровень: Junior+.

## Условие
В каталоге материалов активные фильтры показаны кнопками-чипами. Вход: UI Kit (design,free=true), Иконки (design,free=false), React-шаблон (code,free=true), ID 1–3. Поля: категория Все/design/code и checkbox «Только бесплатные». По умолчанию все три. Кнопка чипа сбрасывает только свой фильтр; исходные поля тоже должны обновиться. Счётчик и список соответствуют выбору. После удаления чипа фокус возвращается к связанному полю. Сделай DOM и React версии с одинаковой чистой filterProducts. Критерии: чипы и результаты вычисляются из двух значений, не хранятся отдельно; category=design + onlyFree=true → ID1. Время: 35–45 минут на обе версии. Крайние случаи: убрать один из двух чипов; нет активных фильтров; бесплатные + code.

## Как рассуждать — вопросы интервьюера
1. Что является источником правды для полей, чипов и списка?
2. Как удалить один фильтр и сохранить второй?
3. Что меняется при переносе из DOM в React?

## Примеры ответов вслух
«Храню category и onlyFree. Чипы и выдачу вычисляю из них: отдельное состояние чипов могло бы разойтись с полями»

«Создам новый объект через spread и заменю одно поле. Для category сброс — пустая строка, для checkbox — false. Затем проверю, что другой фильтр продолжает действовать»

«Чистая функция остаётся той же. В DOM явно синхронизирую value/checked и список; в React связываю поля со state и описываю JSX. Checkbox читаю через checked. После удаления кнопки возвращаю фокус к управлению»

## Пошаговый разбор
1. Определи объект фильтров и значения сброса каждого поля.
2. В чистой функции объедини ограничения через &&; выключенный фильтр не ограничивает выдачу.
3. В DOM обновляй состояние из change, а render синхронизирует все представления.
4. В React используй функциональное обновление объекта и controlled inputs; visible вычисляй при рендере.
5. Строй чипы только для активных фильтров; на удаление измени одно поле и верни фокус.

Типичные ошибки: Удалить чип только из DOM, сохранив фильтр; сбросить весь объект вместо одного поля; читать value у checkbox; хранить результаты независимо от filters; потерять фокус после удаления кнопки.

Ручные проверки: Старт: 3 карточки, чипов нет. Дизайн: 1/2 и один чип. Включи бесплатные: только 1 и два чипа. Удали категорию: 1/3, checkbox остаётся включённым. Удали бесплатные: все 3. Выбери code+free: только 3. Tab до чипа, Enter: чип исчезает, фокус на связанном поле.

Альтернатива: Можно описать фильтры массивом конфигурации и генерировать чипы через map. Это уменьшает повторение при множестве полей, но для двух разнородных фильтров явные условия читаются проще. DOM и React могут использовать общий модуль функции фильтрации; здесь копии сохранены ради независимого запуска примеров. Фокус через getElementById — уже знакомый приём; он выполняется в обработчике, не при рендере. Для многократно используемого React-компонента далее изучи useRef и избегай глобальных ID.

## Запуск
npm ci, затем npm run dev. Проверки: npm run build, npm run lint.

[Другая реализация](../../Javascript/task-41/).

## Полный код — после самостоятельной попытки

<details><summary>Решение с комментариями</summary>

### src/App.jsx

```jsx
import { useState } from "react";

const products = [
  { id: 1, title: "UI Kit", category: "design", free: true },
  { id: 2, title: "Иконки", category: "design", free: false },
  { id: 3, title: "React-шаблон", category: "code", free: true },
];

function filterProducts(items, filters) {
  // Пустая категория разрешает любую; включённый флажок требует free === true.
  // Оба ограничения должны выполняться одновременно.
  return items.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.onlyFree || item.free)
  );
}

export default function FilterChips() {
  // Только исходный выбор — state. Чипы, результаты и счётчик не дублируем.
  const [filters, setFilters] = useState({ category: "", onlyFree: false });
  const visible = filterProducts(products, filters);
  function change(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }
  function remove(field) {
    change(field, field === "category" ? "" : false);
    // Фокус — действие обработчика. Для этого учебного примера используем ID.
    // В компонентной библиотеке такие обращения обычно заменяют useRef.
    document.getElementById(field === "category" ? "category" : "free").focus();
  }
  return (
    <main>
      <h1>Материалы</h1>
      <label htmlFor="category">Категория</label>
      <select id="category" value={filters.category} onChange={(e) => change("category", e.target.value)}>
        <option value="">Все</option><option value="design">Дизайн</option><option value="code">Код</option>
      </select>
      {/* Для checkbox читаем checked, а не строковое value. */}
      <label><input id="free" type="checkbox" checked={filters.onlyFree} onChange={(e) => change("onlyFree", e.target.checked)} />Только бесплатные</label>
      <div aria-label="Активные фильтры">
        {/* После удаления чипа управляемое поле само отображает сброшенное значение. */}
        {filters.category && <button type="button" onClick={() => remove("category")}>Убрать фильтр: {filters.category === "design" ? "Дизайн" : "Код"}</button>}
        {filters.onlyFree && <button type="button" onClick={() => remove("onlyFree")}>Убрать фильтр: Бесплатные</button>}
      </div>
      <p role="status">{visible.length ? "Найдено: " + visible.length : "Ничего не найдено"}</p>
      <ul>{visible.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
    </main>
  );
}
```

</details>
