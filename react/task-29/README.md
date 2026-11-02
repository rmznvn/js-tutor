# React: выбрать все видимые карточки
Выпуск: 2 ноября 2026.

## Условие
В списке статьи: 1 «React: состояние», 2 «Webflow CMS», 3 «React: формы», 4 «События DOM».
Сделай поиск по названию, checkbox у каждой статьи и кнопку выбора всех видимых.
Поиск без учёта регистра, пробелы по краям игнорируются.
Если выбраны не все видимые, кнопка добавляет недостающие. Если выбраны все — снимает только видимые. Скрытые выбранные статьи сохраняются.
Покажи количество выбранных всего и среди видимых. При пустой выдаче кнопка недоступна.
Критерий готовности: хранить query и уникальные selectedIds; видимый список и счётчики вычислять. Checkbox controlled, ключи по ID.
Крайние случаи: часть видимых уже выбрана; выбранная карточка скрылась поиском; пустая выдача.
Время: 30–40 минут.

## Как рассуждать
1. Поиск должен менять выбранные ID или только видимый список?
2. Чем «снять видимые» отличается от полного сброса?
3. Как исключить повторяющиеся ID?

Сначала определи два множества: выбранные ID и видимые ID. Для четырёх статей достаточно обычных массивов; Set не требуется.

## Примеры ответов вслух
«Поиск изменит только видимость. В selectedIds оставлю и скрытые статьи, чтобы пользователь не терял выбор».
«Когда все видимые выбраны, удалю из selectedIds только совпадающие с visibleIds. Присваивание пустого массива ошибочно снимет также скрытые».
«Если выбор частичный, добавлю только недостающие ID через filter и includes. В функциональном setter проверю актуальный массив. Количество среди видимых вычислю как число пересечений».
«Пустой список обработаю явно: кнопку заблокирую и не буду считать его состоянием “всё выбрано”. Проверю, что повторное массовое действие не создаёт дубликатов».

## Пошаговый разбор
1. Создай query и selectedIds.
2. Вычисли visible и visibleIds.
3. Посчитай выбранные видимые ID.
4. Определи, выбраны ли все видимые, отдельно исключив пустую выдачу.
5. Для одной карточки добавляй/удаляй ID.
6. В массовом обработчике добавляй недостающие либо удаляй только видимые.
7. Выведи два счётчика и пустое состояние.

Ошибки: очищать выбор при поиске; setSelectedIds(visibleIds) теряет скрытый выбор; добавлять все ID без исключения дубликатов; хранить отдельные состояния счётчиков.
Проверка: выбрать Webflow CMS → поиск React → выбрать видимые → всего 3, среди видимых 2 → снять видимые → всего 1, среди видимых 0 → очистить поиск → Webflow CMS отмечен. Несуществующий запрос блокирует кнопку.
Альтернатива: объект { [id]: true } вместо массива ID. Проверка выбора удобна по ключу, но удаление ключей и подсчёт потребуют других операций. Для маленького списка массив проще; при большом списке можно рассмотреть Set, всегда создавая новый экземпляр при обновлении.

## Запуск
В папке задачи: npm ci, npm run dev. В Codespaces: npm run dev -- --host 0.0.0.0 и открой предложенный порт.

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### src/App.jsx

```jsx
import { useState } from "react";

const articles = [
  { id: 1, title: "React: состояние" },
  { id: 2, title: "Webflow CMS" },
  { id: 3, title: "React: формы" },
  { id: 4, title: "События DOM" },
];

export default function SelectVisibleArticles() {
  const [query, setQuery] = useState("");
  // Храним ID всех выбранных статей, включая временно скрытые.
  const [selectedIds, setSelectedIds] = useState([]);

  const normalizedQuery = query.trim().toLowerCase();
  const visible = articles.filter((article) =>
    article.title.toLowerCase().includes(normalizedQuery)
  );
  const visibleIds = visible.map((article) => article.id);
  const selectedVisibleCount = visibleIds.filter(
    (id) => selectedIds.includes(id)
  ).length;

  // Для пустого списка считаем «все выбраны» ложным.
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  function toggleOne(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }

  function toggleVisible() {
    if (visibleIds.length === 0) return;
    setSelectedIds((current) => {
      // Проверяем актуальное состояние внутри функционального setter.
      const allSelected =
        visibleIds.filter((id) => current.includes(id)).length ===
        visibleIds.length;

      if (allSelected) {
        // Убираем только видимые ID: скрытый выбор сохраняется.
        return current.filter((id) => !visibleIds.includes(id));
      }

      // Добавляем только недостающие ID, исключая дубликаты.
      const missingIds = visibleIds.filter((id) => !current.includes(id));
      return [...current, ...missingIds];
    });
  }

  return (
    <main>
      <h1>Выбор статей</h1>
      <label>
        Поиск по названию
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <button
        type="button"
        disabled={visible.length === 0}
        onClick={toggleVisible}
      >
        {allVisibleSelected ? "Снять выбор видимых" : "Выбрать видимые"}
      </button>

      {/* Общий и видимый выбор считаем из одного массива ID. */}
      <p role="status">
        Выбрано всего: {selectedIds.length}. Среди видимых: {selectedVisibleCount}.
      </p>

      {visible.length === 0 ? <p>Ничего не найдено</p> : (
        <ul>
          {visible.map((article) => (
            <li key={article.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(article.id)}
                  onChange={() => toggleOne(article.id)}
                />
                {article.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

</details>
