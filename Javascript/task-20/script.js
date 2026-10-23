const resources = [
  { id: 1, title: "Методы массивов", format: "article", topics: ["js"] },
  { id: 2, title: "Состояние React", format: "video", topics: ["react"] },
  { id: 3, title: "React в интерфейсе сайта", format: "guide", topics: ["react", "webflow"] },
  { id: 4, title: "Webflow CMS", format: "article", topics: ["webflow"] },
];

function filterResources(items, { formats = [], topics = [] } = {}) {
  // filter создаёт новый массив; исходные объекты и их topics не меняются.
  return items.filter((item) => {
    // Пустая группа не ограничивает выдачу.
    // includes реализует ИЛИ: подойдёт любой выбранный формат.
    const matchesFormat =
      formats.length === 0 || formats.includes(item.format);

    // some возвращает true, если хотя бы одна тема карточки выбрана.
    // Это также ИЛИ внутри группы тем.
    const matchesTopic =
      topics.length === 0 ||
      item.topics.some((topic) => topics.includes(topic));

    // Между разными группами действует И: пройти нужно обе проверки.
    return matchesFormat && matchesTopic;
  });
}

// Два формата + две темы → карточки 1 и 3 в исходном порядке.
console.log(filterResources(resources, {
  formats: ["article", "guide"],
  topics: ["js", "react"],
}));
// Пустые группы → все четыре; исходный resources не изменяется.
console.log(filterResources(resources));
