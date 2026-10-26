const menuItems = [
  { id: "home", title: "Главная" },
  { id: "media", title: "Медиацентр" },
  { id: "contacts", title: "Контакты" },
];

function moveMenuItem(items, id, direction) {
  // Контракт направления: только -1 (вверх) или 1 (вниз).
  if (direction !== -1 && direction !== 1) return items;

  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items; // Неизвестный ID ничего не меняет.

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;

  // Порядок меняем в новом массиве. Сами объекты не редактируем,
  // поэтому поверхностной копии достаточно.
  const result = [...items];
  [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  return result;
}

// Медиацентр поднимается перед Главной; исходный menuItems не меняется.
console.log(moveMenuItem(menuItems, "media", -1));
// Попытка поднять первый пункт — безопасное отсутствие изменений.
console.log(moveMenuItem(menuItems, "home", -1));
