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
