# Скрываемый баннер с localStorage — JavaScript

Выпуск **2026-10-16**. Время: **25–35 минут**.

## Условие

Обычное закрытие баннера действует до перезагрузки; «Больше не показывать» сохраняет решение.

### Входные данные и критерии готовности

- Ключ хранится в константе; сравнение только со строкой 'true'.
- Первое посещение показывает баннер.
- Закрыть меняет только DOM; постоянное закрытие пишет localStorage.
- Сброс удаляет ключ и показывает баннер.
- Ошибки getItem/setItem/removeItem не ломают страницу; понятный статус.

### Крайние случаи

- Ключ отсутствует.
- Неожиданное значение.
- Хранилище недоступно.

## Как рассуждать

1. **Интервьюер:** «Чем различаются способы закрытия?»
2. **Интервьюер:** «Что возвращает getItem?»
3. **Интервьюер:** «Что делать при ошибке записи?»

Сначала отдели исходные данные от состояния интерфейса. Предскажи результат одного действия на маленьком примере и определи, что хранить, а что можно вычислять. Затем выбери преобразование данных и свяжи его с отображением.

## Как отвечать вслух на собеседовании

> «Обычное закрытие только скрывает DOM. Постоянное дополнительно пишет строку в хранилище.»

> «Строку или null. Только точное 'true' означает постоянное скрытие.»

> «try/catch оставит интерфейс рабочим; баннер закрою сейчас и сообщу, что настройка не сохранена.»

## Пошаговый разбор

1. Создать безопасные read/save/remove.
2. Создать show/hide.
3. Подключить три кнопки.
4. При загрузке применить сохранённое решение.

## Типичные ошибки

- Сравнивать с boolean true.
- Писать storage при обычном закрытии.
- Ожидать, что removeItem обновит DOM.

## Альтернативный способ

Cookie подходит, если настройка нужна серверу; для клиентского интерфейса localStorage проще и не добавляется к HTTP-запросам.

## Ручная проверка

Закрой и обнови — виден; скрой постоянно и обнови — скрыт; сбрось — виден.

## Запуск

Открой `index.html`. Для localStorage удобнее запуск через локальный HTTP-сервер (например Live Server в VS Code); для чистой функции смотри DevTools → Console.

## Полное решение с комментариями

Код расположен в конце, чтобы сначала можно было решить задачу самостоятельно.

<details>
<summary>Показать рабочий код</summary>

### script.js

```js
const STORAGE_KEY = "conferenceAnnouncementDismissed";
const banner = document.getElementById("banner");
const statusElement = document.getElementById("status");
function readDismissedSetting() {
  try {
    // getItem возвращает строку либо null; другие значения не скрывают баннер.
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch (error) { console.warn(error); return false; }
}
function saveDismissedSetting() {
  try { localStorage.setItem(STORAGE_KEY, "true"); return true; }
  catch (error) { console.warn(error); return false; }
}
function removeDismissedSetting() {
  try { localStorage.removeItem(STORAGE_KEY); return true; }
  catch (error) { console.warn(error); return false; }
}
function showAnnouncement() { banner.hidden = false; }
function hideAnnouncement() { banner.hidden = true; }
document.getElementById("close").addEventListener("click", () => {
  hideAnnouncement(); // Только текущая страница; storage не меняется.
  statusElement.textContent = "Баннер скрыт до перезагрузки.";
});
document.getElementById("dismiss").addEventListener("click", () => {
  const saved = saveDismissedSetting();
  hideAnnouncement(); // Текущее действие выполняем даже при ошибке storage.
  statusElement.textContent = saved ? "Настройка сохранена." : "Баннер скрыт, но настройка не сохранена.";
});
document.getElementById("reset").addEventListener("click", () => {
  if (removeDismissedSetting()) {
    showAnnouncement(); // Изменение storage не обновляет DOM само по себе.
    statusElement.textContent = "Настройка сброшена.";
  } else statusElement.textContent = "Не удалось сбросить настройку.";
});
if (readDismissedSetting()) hideAnnouncement();
else showAnnouncement();

```

### index.html

```html
<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Практика JavaScript</title><style>body{font-family:system-ui;padding:2rem;max-width:60rem;margin:auto}label{display:block;margin-top:1rem}button,input,textarea,select{font:inherit;margin:.3rem}button{cursor:pointer}[hidden]{display:none!important}</style></head>
<body><main><aside id="banner" aria-labelledby="banner-title"><h1 id="banner-title">Регистрация на конференцию открыта</h1><p>Информационный баннер</p><button id="close" type="button">Закрыть</button><button id="dismiss" type="button">Больше не показывать</button></aside><button id="reset" type="button">Сбросить настройку баннера</button><p id="status" role="status"></p></main><script src="./script.js"></script></body>
</html>

```

</details>
