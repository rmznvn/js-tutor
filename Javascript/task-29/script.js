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
