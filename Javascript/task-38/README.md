# JavaScript: недавно просмотренные товары

Выпуск: 13 ноября 2026.

## Условие

На странице каталога есть карточки товаров и блок «Вы недавно смотрели».

Данные каталога:

- p-101 — Настольная лампа — 4200 ₽
- p-102 — Кресло — 18900 ₽
- p-103 — Настенный светильник — 6500 ₽
- p-104 — Стол — 24500 ₽
- p-105 — Книжная полка — 11200 ₽

Реализуй поведение кнопки «Открыть карточку». Переход на другую страницу не нужен: клик только обновляет историю просмотров.

Ожидаемое поведение:

1. Последний просмотренный товар находится первым.
2. Один товар не может встречаться в истории дважды. Повторный просмотр перемещает его в начало.
3. Хранится максимум 4 товара.
4. История сохраняется после перезагрузки страницы через localStorage.
5. Если история пустая, показывается сообщение.
6. Для карточек и истории используй DOM-элементы и textContent, а не вставку пользовательского текста через innerHTML.

Критерии готовности: храни в localStorage только ID товаров, а не полные объекты; проверяй восстановленные данные; не изменяй исходный массив каталога.

Крайние случаи:

- Повторно открыть уже просмотренный товар: он должен переместиться в начало, а не дублироваться.
- Посмотреть пять разных товаров: в истории останутся только четыре последних.
- В localStorage лежит некорректный JSON или ID неизвестного товара: приложение не должно падать.

Время: 25–30 минут.

## Как рассуждать — вопросы интервьюера

1. Почему лучше хранить ID товаров, а не копии объектов?
2. Как переместить товар в начало без дубликатов?
3. Как восстановить историю, если localStorage содержит некорректные данные?
4. Почему для кликов подходит один обработчик на контейнере?
5. Почему для вывода названия лучше textContent, а не innerHTML?

## Примеры ответов вслух

«Каталог уже содержит полные данные товаров, поэтому в истории достаточно хранить ID. При рендере я найду товар в исходном массиве. Если цена или название изменятся в каталоге, история не сохранит устаревшую копию объекта».

«Сначала отфильтрую из старой истории ID текущего товара, затем добавлю его в начало и ограничу массив четырьмя элементами через slice. Так повторный просмотр не создаёт дубликат».

«JSON.parse может выбросить ошибку, поэтому чтение localStorage оберну в try/catch. Дополнительно проверю, что результат — массив, а ID существуют в каталоге. Неизвестные и повторные ID отфильтрую».

«Все кнопки находятся внутри одного контейнера. Обработчик на контейнере использует closest, чтобы найти нажатую кнопку. Это делегирование событий: не нужно создавать отдельный обработчик для каждой карточки».

«Создам элементы через document.createElement и вставлю названия через textContent. Так строка воспринимается как текст, а не как HTML-разметка».

## Пошаговый разбор

1. Подготовь массив товаров — это единственный источник названий и цен.
2. Прочитай историю из localStorage. После JSON.parse проверь тип результата и существование каждого ID в каталоге.
3. При клике получи ID из data-product-id.
4. Создай новый массив: текущий ID первым, затем прежние ID без него.
5. Обрежь массив до четырёх элементов.
6. Сохрани JSON.stringify нового массива в localStorage.
7. Отрисуй историю заново: найди товары по ID, создай li и заполни его через textContent.
8. Если localStorage недоступен для записи, текущая страница всё равно должна продолжить работу за счёт массива в памяти.

Типичные ошибки:

- Сохранять в localStorage целые объекты, хотя достаточно ID.
- Сначала добавлять ID, а потом забывать удалить его старое вхождение.
- Использовать sort для изменения порядка — здесь сортировка по полю не нужна.
- Считать, что JSON.parse всегда возвращает массив.
- Использовать innerHTML для названий.
- Изменять исходный массив каталога при просмотре товара.

## Ручные проверки

| Действие | Ожидаемый результат |
|---|---|
| Открыть p-101 | p-101 первый |
| Открыть p-102 | p-102, p-101 |
| Снова открыть p-101 | p-101, p-102; дублей нет |
| Открыть ещё три товара | Останутся только четыре последних |
| Перезагрузить страницу | История сохранится |
| Очистить localStorage | Появится сообщение об отсутствии просмотров |
| Записать в localStorage строку не-JSON | Страница не упадёт |

## Альтернативный подход

Можно хранить историю только в массиве JavaScript без localStorage. Это проще и подходит для временного состояния, но после перезагрузки список исчезнет. Можно хранить целые объекты товаров, однако тогда история может содержать устаревшие названия и цены. Для каталога предпочтительнее сохранять ID.

## Запуск

Открой index.html в браузере. Для проверки сохранения обнови страницу после нескольких кликов. История хранится в localStorage текущего origin.

## Полный код — после самостоятельной попытки

### index.html

~~~html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Недавно просмотренные товары</title>
</head>
<body>
  <main>
    <h1>Каталог</h1>
    <div id="product-grid"></div>

    <section aria-labelledby="recent-title">
      <h2 id="recent-title">Вы недавно смотрели</h2>
      <p id="recent-empty" aria-live="polite">Вы пока не открывали товары.</p>
      <ul id="recent-list" aria-live="polite"></ul>
    </section>
  </main>
  <script src="./script.js"></script>
</body>
</html>
~~~

### script.js

~~~js
const products = [
  { id: "p-101", name: "Настольная лампа", price: 4200 },
  { id: "p-102", name: "Кресло", price: 18900 },
  { id: "p-103", name: "Настенный светильник", price: 6500 },
  { id: "p-104", name: "Стол", price: 24500 },
  { id: "p-105", name: "Книжная полка", price: 11200 },
];

const STORAGE_KEY = "js-tutor:recent-products";
const MAX_RECENT = 4;

const productGrid = document.querySelector("#product-grid");
const recentList = document.querySelector("#recent-list");
const emptyState = document.querySelector("#recent-empty");

// Восстанавливаем ID, но не доверяем содержимому localStorage.
function readRecentIds() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    // Даже корректный JSON может содержать не массив.
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((id, index) => {
        // Оставляем только ID, которые есть в текущем каталоге.
        const existsInCatalog = products.some((product) => product.id === id);

        // Если ID повторяется, сохраняем только первое вхождение.
        const isFirstOccurrence = parsed.indexOf(id) === index;

        return existsInCatalog && isFirstOccurrence;
      })
      .slice(0, MAX_RECENT);
  } catch (error) {
    // Например, JSON.parse выбросил SyntaxError или storage недоступен.
    return [];
  }
}

// Сохраняем только массив ID. Ошибка storage не должна ломать каталог.
function saveRecentIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    // История останется доступной в памяти до перезагрузки страницы.
  }
}

// Создаём карточки из данных каталога.
function renderProducts() {
  productGrid.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const button = document.createElement("button");

    title.textContent = product.name;
    price.textContent = product.price.toLocaleString("ru-RU") + " ₽";

    button.type = "button";
    button.textContent = "Открыть карточку";
    // data-атрибут связывает кнопку с конкретным товаром.
    button.dataset.productId = product.id;

    card.append(title, price, button);
    productGrid.append(card);
  });
}

// Рисуем историю по ID, используя актуальные объекты из каталога.
function renderRecent() {
  recentList.replaceChildren();

  const recentProducts = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  emptyState.hidden = recentProducts.length > 0;

  recentProducts.forEach((product) => {
    const item = document.createElement("li");

    // textContent вставляет название как обычный текст.
    item.textContent =
      product.name + " — " + product.price.toLocaleString("ru-RU") + " ₽";

    recentList.append(item);
  });
}

// Текущее состояние истории хранится в памяти и синхронизируется с storage.
let recentIds = readRecentIds();

// Один обработчик обслуживает все кнопки внутри каталога.
productGrid.addEventListener("click", (event) => {
  // closest позволяет нажать не только на текст кнопки, но и на её вложенный элемент.
  const button = event.target.closest("button[data-product-id]");

  // Игнорируем клики по карточке вне кнопки.
  if (!button || !productGrid.contains(button)) return;

  const productId = button.dataset.productId;

  // Защищаемся от неизвестного ID, даже если DOM был изменён вручную.
  const existsInCatalog = products.some((product) => product.id === productId);
  if (!existsInCatalog) return;

  // Удаляем старое вхождение ID, добавляем его в начало и ограничиваем длину.
  recentIds = [
    productId,
    ...recentIds.filter((id) => id !== productId),
  ].slice(0, MAX_RECENT);

  saveRecentIds(recentIds);
  renderRecent();
});

// Сначала создаём каталог, затем восстанавливаемую историю.
renderProducts();
renderRecent();
~~~
