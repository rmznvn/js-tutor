// Интервалы заданы минутами от начала дня: 600 = 10:00.
const slots = [
  { id: 1, start: 600, end: 630 },
  { id: 2, start: 630, end: 660 },
  { id: 3, start: 660, end: 690 },
  { id: 4, start: 690, end: 720 },
];
const bookings = [{ start: 630, end: 660 }];

function getAvailableSlots(items, busy, minDuration) {
  // filter создаёт новый массив; исходные интервалы остаются неизменными.
  return items.filter((slot) => {
    // Ровно нужная длительность подходит: используем >=, а не >.
    const longEnough = slot.end - slot.start >= minDuration;
    // some отвечает на вопрос «есть хотя бы одно пересечение?».
    // Строгие сравнения разрешают соседние интервалы: [600,630) и [630,660).
    const overlaps = busy.some((booking) =>
      slot.start < booking.end && booking.start < slot.end
    );
    // Оставляем только достаточно длинные слоты без пересечений.
    return longEnough && !overlaps;
  }).sort((a, b) => a.start - b.start); // Сортируем результат filter, не items.
}

function formatTime(minutes) {
  // Целая часть — часы, остаток — минуты; padStart добавляет ведущий ноль.
  return String(Math.floor(minutes / 60)).padStart(2, "0") + ":" +
    String(minutes % 60).padStart(2, "0");
}

const input = document.getElementById("duration");
const list = document.getElementById("slots");
const message = document.getElementById("message");
function render() {
  // value у select — строка. Преобразуем её перед числовым сравнением.
  const visible = getAvailableSlots(slots, bookings, Number(input.value));
  list.replaceChildren();
  message.textContent = visible.length ? "Свободных слотов: " + visible.length : "Нет подходящих слотов";
  visible.forEach((slot) => {
    const li = document.createElement("li");
    // Данные выводим текстом: HTML из названий сюда не подставляется.
    li.textContent = formatTime(slot.start) + "–" + formatTime(slot.end);
    list.append(li);
  });
}
input.addEventListener("change", render);
render();
