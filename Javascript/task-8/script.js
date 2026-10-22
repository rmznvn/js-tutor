// Чистая функция: строка → новый массив нормализованных тегов.
function prepareTags(input) {
  const normalizedTags = input.split(",")
    // Каждый элемент преобразуется независимо; внутренние пробелы сохраняются.
    .map((tag) => tag.trim().toLowerCase())
    // Пустые части, в том числе из пробелов, исключаются.
    .filter((tag) => tag !== "");
  const uniqueTags = [];
  normalizedTags.forEach((tag) => {
    // Мутировать новый локальный массив можно: внешние данные не затронуты.
    if (!uniqueTags.includes(tag)) uniqueTags.push(tag);
  });
  return uniqueTags;
}
// Альтернатива: те же правила в одном цикле, без map/filter.
function prepareTagsWithLoop(input) {
  const result = [];
  for (const part of input.split(",")) {
    const tag = part.trim().toLowerCase();
    if (tag !== "" && !result.includes(tag)) result.push(tag);
  }
  return result;
}
console.log(prepareTags("  Webflow, React, , webflow, JavaScript, REACT "));
console.log(prepareTags(" , , "));
console.log(prepareTagsWithLoop("web development,React,REACT"));
