# JavaScript → React: квиз самооценки
Выпуск: 2 ноября 2026.

## Условие
Квиз содержит три вопроса: работа с CMS, создание форм, работа с событиями.
В каждом одинаковые варианты: 0 «Пока не пробовала», 1 «Делаю с подсказкой», 2 «Делаю самостоятельно».
Начальные ответы отсутствуют. Сделай DOM- и React-версии.
Покажи «Отвечено: N из 3». Кнопка «Подвести итог» доступна только после трёх ответов и показывает сумму из 6. Переответ заменяет старое значение и скрывает прежний итог. «Начать заново» снимает все отметки, сбрасывает прогресс и итог.
Это условная самооценка, не оценка твоего реального уровня.
Критерий готовности: хранить ответы по ID и флаг показа итога; прогресс/сумму вычислять. Ноль считается ответом, не пропуском. Варианты одного вопроса объединены name.
Крайние случаи: все ответы 0 → завершено, сумма 0; переответ не увеличивает число ответов; сброс после итога.
Время: 35–45 минут на обе версии.

## Как рассуждать
1. Чем отсутствие ответа отличается от ответа 0?
2. Почему сумма не должна накапливаться при каждом клике?
3. Где хранить ответы и как связать radio?

DOM input.value — строка: перед арифметикой преобразуй в Number. Ключ объекта — ID вопроса, значение — его последний ответ.

## Примеры ответов вслух
«Использую объект answers. Отсутствующий ключ даёт undefined, а 0 — допустимый ответ. Проверка if (value) неверно посчитает ноль пропуском, поэтому сравню с undefined».
«Сумму и количество вычислю через reduce с начальным { answered: 0, score: 0 }. Переответ заменит значение по ID, а не прибавит новые баллы к старым».
«Варианты одного вопроса получат одинаковый name, разные вопросы — разные name. В React checked сравню с текущим числом в answers; в DOM прочитаю строку и преобразую её в Number».
«Храню отдельный showResult, потому что полный набор ответов ещё не означает нажатие кнопки итога. После изменения скрываю старый итог. Проверю три нуля, переответ и сброс».

## Пошаговый разбор
1. Опиши вопросы и варианты данными.
2. Создай answers и showResult.
3. Создай группы radio.
4. На change замени ответ по ID и скрой итог.
5. Через reduce вычисли отвеченное количество и сумму.
6. При submit проверь полноту, затем покажи итог.
7. При сбросе очисти ответы и флаг.

В DOM элементы создаются один раз, render обновляет checked и текст, сохраняя фокус. React создаёт описание интерфейса через map; стабильные key связывают элементы между рендерами.
Ошибки: if(value) теряет ноль; сложение строк; накапливать баллы вместо пересчёта; одинаковое name у всех вопросов; не снимать controlled-отметки при сбросе.
Проверки: три нуля → 3 из 3, 0 из 6; изменить один ответ на 2 → итог скрыт, после кнопки 2 из 6; число ответов остаётся 3; сброс → 0 из 3, итог пуст, кнопка недоступна.
Альтернатива: массив объектов { questionId, value }. Удобно отправлять списком, но переответ требует map/find; объект по ID проще для прямого доступа. Для вычисления результата вместо reduce подойдёт цикл: легче отлаживать по шагам, но аккумулятор придётся обновлять явно.

## Запуск
JavaScript: открой index.html. React: npm ci, npm run dev; Codespaces: npm run dev -- --host 0.0.0.0.

[Сравнить с другой реализацией](../../react/task-30/).

## Полный код — после самостоятельной попытки

<details>
<summary>Раскрыть решение с комментариями</summary>

### index.html

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Самооценка навыков</title>
</head>
<body>
  <h1>Самооценка навыков</h1>
  <form id="quiz">
    <div id="questions"></div>
    <p id="progress" role="status"></p>
    <button id="finish" type="submit" disabled>Подвести итог</button>
    <button id="clear" type="button">Начать заново</button>
    <p id="result" role="status"></p>
  </form>
  <script src="./script.js"></script>
</body>
</html>
```

### script.js

```js
const questions = [
  { id: "cms", title: "Насколько уверенно работаешь с CMS?" },
  { id: "forms", title: "Насколько уверенно создаёшь формы?" },
  { id: "events", title: "Насколько уверенно работаешь с событиями?" },
];
const options = [
  { value: 0, label: "Пока не пробовала" },
  { value: 1, label: "Делаю с подсказкой" },
  { value: 2, label: "Делаю самостоятельно" },
];

function getSummary(answers) {
  // Проходим по известным вопросам, а не по произвольным ключам answers.
  return questions.reduce((summary, question) => {
    const value = answers[question.id];
    // 0 — полноценный ответ. Проверка if (value) потеряла бы его.
    const isAnswered = value !== undefined;
    return {
      answered: summary.answered + Number(isAnswered),
      score: summary.score + (value ?? 0),
    };
  }, { answered: 0, score: 0 });
}

let answers = {}; // Отсутствующий ключ означает отсутствие ответа.
let showResult = false;

const form = document.getElementById("quiz");
const container = document.getElementById("questions");
const progress = document.getElementById("progress");
const finish = document.getElementById("finish");
const result = document.getElementById("result");

// Создаём элементы один раз: обновления не будут терять фокус radio.
questions.forEach((question) => {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = question.title;
  fieldset.append(legend);

  options.forEach((option) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    // Одинаковое name объединяет варианты одного вопроса.
    input.name = question.id;
    input.value = String(option.value);
    label.append(input, document.createTextNode(option.label));
    fieldset.append(label);
  });
  container.append(fieldset);
});

function render() {
  const summary = getSummary(answers);
  progress.textContent =
    "Отвечено: " + summary.answered + " из " + questions.length;
  finish.disabled = summary.answered !== questions.length;

  // Синхронизируем отметки также после полного сброса.
  container.querySelectorAll("input").forEach((input) => {
    input.checked = answers[input.name] === Number(input.value);
  });
  result.textContent = showResult
    ? "Баллы самооценки: " + summary.score + " из 6"
    : "";
}

form.addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches('input[type="radio"]')) return;
  // DOM возвращает строку. Преобразуем её, иначе сумма станет склейкой.
  answers = { ...answers, [input.name]: Number(input.value) };
  showResult = false; // Прежний итог устарел после изменения ответа.
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  // Проверяем полноту и в обработчике, независимо от disabled.
  if (getSummary(answers).answered !== questions.length) return;
  showResult = true;
  render();
});

document.getElementById("clear").addEventListener("click", () => {
  answers = {};
  showResult = false;
  render();
});
render();
```

</details>
