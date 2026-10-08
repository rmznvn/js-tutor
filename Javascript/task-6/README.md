# Статистика опубликованных материалов по категориям — JavaScript

Материал из выпуска **2026-10-07**. Время: **25–30 минут**.

## Условие

Панель медиатеки показывает число опубликованных материалов каждой категории.

### Критерии готовности

- getCategoryStats учитывает только published: true.
- Возвращает массив {category, count}.
- Сортировка по count по убыванию; при равенстве — категория по алфавиту.
- Вход не изменяется; пустой массив даёт [].

### Ожидаемое поведение

| Категория | Опубликовано |
|---|---:|
| AI | 2 |
| BIM | 2 |
| СОД | 1 |

### Крайние случаи

- Категория только с черновиками не появляется.
- Равные количества.
- Пустой массив.

## Как рассуждать

1. **Интервьюер:** «На какие этапы разбить задачу?»

2. **Интервьюер:** «Какой аккумулятор выбрать?»

3. **Интервьюер:** «Как посчитать первое появление категории?»

4. **Интервьюер:** «Зачем второй критерий сортировки?»

Определи вход, результат и ограничения. Разбей действие на преобразование данных и отображение. Перед написанием кода предскажи результат на маленьком примере.

## Как отвечать на собеседовании

> «Отфильтрую опубликованные, накоплю счётчики, превращу объект в массив и отсортирую.»

> «Категория соответствует одному числу: подходит объект с ключами-категориями.»

> «Значение ?? 0 заменит отсутствие свойства нулём; затем прибавлю единицу.»

> «При равном count использую localeCompare: это делает результат соответствующим условию.»

## Пошаговый разбор

1. Оставить published через filter.
2. Собрать объект через reduce.
3. Вернуть аккумулятор после увеличения счётчика.
4. Object.entries даёт пары ключ/значение.
5. map создаёт объекты результата.
6. sort нового массива сравнивает count и названия.

## Типичные ошибки

- Забытый return ломает reduce.
- Подсчёт до фильтрации включает черновики.
- sort исходного массива меняет вход.

## Альтернативный способ

Один reduce может пропускать черновики внутри callback; это убирает промежуточный массив, но объединяет два этапа. В архивном решении аккумулятор без прототипа защищает категории с именами вроде constructor.

## Проверка

Сопоставь результаты с таблицей выше и проверь каждый крайний случай. Для неизменяемых обновлений дополнительно проверь сохранение исходных данных и отсутствие влияния на соседние элементы.

## Запуск

Открой `index.html` в браузере. Для задач на данные смотри DevTools → Console. Файл `script.js` содержит эталонное решение; для самостоятельной попытки сначала прочитай условие и создай свой файл.

## Полное решение с комментариями

Рабочий файл: [script.js](script.js). Код помещён в конце, чтобы можно было сначала решить задачу самостоятельно.

<details>
<summary>Показать полный код</summary>

```js
const materials = [
  { id: 1, title: "Что такое BIM", category: "BIM", published: true },
  { id: 2, title: "AI в строительстве", category: "AI", published: true },
  { id: 3, title: "Проверка модели", category: "BIM", published: false },
  { id: 4, title: "Общие данные", category: "СОД", published: true },
  { id: 5, title: "BIM для команды", category: "BIM", published: true },
  { id: 6, title: "Нейросети", category: "AI", published: true },
];

function getCategoryStats(materials) {
  // Сначала исключаем неопубликованные материалы.
  const publishedMaterials = materials.filter((material) => material.published);
  const statsByCategory = publishedMaterials.reduce((stats, material) => {
    // ?? подставляет 0, если категория встретилась впервые.
    stats[material.category] = (stats[material.category] ?? 0) + 1;
    // Изменяем только локальный аккумулятор, не входные объекты.
    return stats;
  }, Object.create(null));
  // Объект без прототипа корректно считает даже категории "constructor".
  // entries даёт пары [ключ, значение], map создаёт объекты результата.
  return Object.entries(statsByCategory)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => {
      // sort применяется к новому массиву, а не к materials.
      const difference = b.count - a.count;
      if (difference !== 0) return difference;
      return a.category.localeCompare(b.category, "ru");
    });
}

// Альтернатива: объединяем пропуск и подсчёт в один проход.
function getCategoryStatsOnePass(materials) {
  const stats = materials.reduce((result, material) => {
    if (!material.published) return result;
    result[material.category] = (result[material.category] ?? 0) + 1;
    return result;
  }, Object.create(null));
  return Object.entries(stats)
    .map(([category, count]) => ({ category, count }))
    // || использует второй критерий только если разница равна 0.
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "ru"));
}
console.log(getCategoryStats(materials));
console.log(getCategoryStats([]));
```

</details>
