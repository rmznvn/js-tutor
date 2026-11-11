const articles = [
  { id: 1, title: "Состояние", category: "React" },
  { id: 2, title: "Коллекции", category: "Webflow" },
  { id: 3, title: "Формы", category: "React" },
  { id: 4, title: "События", category: "JavaScript" },
  { id: 5, title: "Динамические страницы", category: "Webflow" },
];

function groupArticles(items) {
  // Аккумулятор — новый массив групп, принадлежащий этой функции.
  return items.reduce((groups, article) => {
    const group = groups.find(
      (item) => item.category === article.category
    );

    if (group) {
      // Меняем только новый внутренний массив группы.
      // Исходная статья и входной массив остаются прежними.
      group.items.push(article);
    } else {
      // Первое появление категории задаёт позицию её группы.
      groups.push({
        category: article.category,
        items: [article],
      });
    }

    // reduce должен получить аккумулятор для следующего шага.
    return groups;
  }, []);
}

// Группы: React [1,3], Webflow [2,5], JavaScript [4].
// Порядок статей внутри групп сохраняется.
console.log(groupArticles(articles));
console.log(groupArticles([])); // Пустой вход → пустые группы.
console.log(articles); // Исходный массив не изменён.
