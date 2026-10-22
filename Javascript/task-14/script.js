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
