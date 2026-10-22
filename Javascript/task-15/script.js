const projects = [
  { id: 1, title: "Жилой комплекс", status: "published" },
  { id: 2, title: "Бизнес-центр", status: "draft" },
  { id: 3, title: "Завод", status: "published" },
  { id: 4, title: "Складской комплекс", status: "draft" },
  { id: 5, title: "Школа", status: "published" },
];
// Контракт функции: неотрицательное целое count, например array.length.
// Для дробных количеств правила склонения другие.
function getObjectWord(count) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "объектов";
  const last = count % 10;
  if (last === 1) return "объект";
  if (last >= 2 && last <= 4) return "объекта";
  return "объектов";
}
function filterProjects(items, status) {
  return status === "all" ? [...items] : items.filter((item) => item.status === status);
}
const filter = document.getElementById("filter");
const countElement = document.getElementById("count");
const empty = document.getElementById("empty");
const list = document.getElementById("list");
let selectedStatus = "all";
function render() {
  const visible = filterProjects(projects, selectedStatus);
  countElement.textContent = visible.length + " " + getObjectWord(visible.length);
  empty.hidden = visible.length !== 0;
  list.replaceChildren();
  visible.forEach((project) => {
    const item = document.createElement("li");
    item.textContent = project.title + (project.status === "published" ? " — опубликован" : " — черновик");
    list.append(item);
  });
}
filter.addEventListener("change", (event) => { selectedStatus = event.target.value; render(); });
render();
[0,1,2,4,5,11,14,21,22,25,111,112].forEach((count) => console.log(count, getObjectWord(count)));
