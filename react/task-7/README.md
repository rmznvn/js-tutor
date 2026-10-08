# Вкладки продукта — React

Материал из выпуска **2026-10-07**. Время: **25–35 минут**.

## Условие

Вкладки Возможности, Интеграции и Безопасность; Интеграции недоступна.

### Критерии готовности

- ProductTabs хранит activeTabId='features'.
- TabButton получает props и callback.
- disabled блокирует недоступную вкладку; обработчик тоже проверяет доступность.
- aria-selected отражает активность.
- Контент определяется через find, отдельного состояния для него нет.
- Повторный клик сохраняет текущую вкладку.

### Ожидаемое поведение

| Действие | Активная вкладка |
|---|---|
| Начало | features |
| Безопасность | security |
| Интеграции | остаётся security |

### Крайние случаи

- Повторный клик.
- Недоступная вкладка.
- Переключение доступных.

## Как рассуждать

1. **Интервьюер:** «Что хранить в состоянии?»

2. **Интервьюер:** «Нужно ли хранить контент?»

3. **Интервьюер:** «Почему ID лучше индекса?»

4. **Интервьюер:** «Где проверить disabled?»

Определи вход, результат и ограничения. Разбей действие на преобразование данных и отображение. Перед написанием кода предскажи результат на маленьком примере.

## Как отвечать на собеседовании

> «Храню один activeTabId. Активный объект вычисляю через find.»

> «Контент уже содержится в tabs и определяется ID: отдельное состояние было бы лишним.»

> «ID не меняет значение при перестановке массива, индекс меняет.»

> «Атрибут ограничивает взаимодействие, проверка в функции защищает само правило выбора.»

## Пошаговый разбор

1. Создать activeTabId.
2. Найти активный объект.
3. Передать кнопкам isActive и onSelect.
4. В callback передать ID родителю.
5. Проверить существование и disabled.
6. Установить доступный ID.
7. Обновить выбранную панель.

## Типичные ошибки

- onClick={onSelect(id)} вызывает функцию при рендере.
- Текст вкладки не стоит использовать как ID.
- Дублирование активного объекта и ID усложняет состояние.

## Альтернативный способ

Индекс подходит для неизменного массива, но ID надёжнее. Архивная версия дополняет исходный пример: все aria-controls имеют существующие панели, есть aria-labelledby, ArrowLeft/Right, Home/End и управляемый tabIndex. Новые действия находятся в обработчике, не требуют useEffect/useRef.

## Проверка

Сопоставь результаты с таблицей выше и проверь каждый крайний случай. Для неизменяемых обновлений дополнительно проверь сохранение исходных данных и отсутствие влияния на соседние элементы.

## Запуск

В терминале перейди в эту папку, затем выполни:

```bash
npm ci
npm run dev
```

Сборка: `npm run build`. Зависимости и lockfile взяты из существующего `react/task-1`. Компонент решения подключён через `src/App.jsx`.

## Полное решение с комментариями

Рабочий файл: [src/components/ProductTabs.jsx](src/components/ProductTabs.jsx). Код помещён в конце, чтобы можно было сначала решить задачу самостоятельно.

<details>
<summary>Показать полный код</summary>

```jsx
import { useState } from "react";

const tabs = [
  { id: "features", label: "Возможности", content: "Просмотр моделей и совместная работа.", disabled: false },
  { id: "integrations", label: "Интеграции", content: "Интеграции находятся в разработке.", disabled: true },
  { id: "security", label: "Безопасность", content: "Разграничение прав доступа.", disabled: false },
];
function TabButton({ tab, isActive, onSelect, onKeyDown }) {
  return (
    // Неактивные вкладки доступны стрелками; Tab фокусирует активную.
    <button type="button" id={`tab-${tab.id}`} role="tab"
      aria-selected={isActive} aria-controls={`panel-${tab.id}`}
      tabIndex={isActive ? 0 : -1} disabled={tab.disabled}
      onClick={() => onSelect(tab.id)} onKeyDown={onKeyDown}>
      {tab.label}
    </button>
  );
}
export default function ProductTabs() {
  const [activeTabId, setActiveTabId] = useState("features");
  // Объект и контент производны от ID: отдельное состояние не нужно.
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  function selectTab(id) {
    const selectedTab = tabs.find((tab) => tab.id === id);
    if (!selectedTab || selectedTab.disabled) return;
    setActiveTabId(id);
  }
  function handleKeyDown(event) {
    // Дополнение к исходному примеру: полноценная клавиатурная навигация.
    // Обработчик события может фокусировать DOM; render остаётся чистым.
    const enabled = tabs.filter((tab) => !tab.disabled);
    const index = enabled.findIndex((tab) => tab.id === activeTabId);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % enabled.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabled.length - 1;
    else return;
    event.preventDefault();
    const nextId = enabled[nextIndex].id;
    selectTab(nextId);
    // Ищем кнопку внутри текущего tablist, а не по всему документу.
    event.currentTarget.parentElement.querySelector(`#tab-${nextId}`).focus();
  }
  return (
    <section>
      <h1>Возможности продукта</h1>
      <div role="tablist" aria-label="Разделы продукта">
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} isActive={tab.id === activeTabId}
            onSelect={selectTab} onKeyDown={handleKeyDown} />
        ))}
      </div>
      {/* Все панели существуют: aria-controls всегда указывает на реальный ID.
          hidden оставляет видимой только активную панель. */}
      {tabs.map((tab) => (
        <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel"
          aria-labelledby={`tab-${tab.id}`} hidden={tab.id !== activeTabId} tabIndex={0}>
          <p>{tab.id === activeTabId ? activeTab?.content : tab.content}</p>
        </div>
      ))}
    </section>
  );
}
```

</details>
