import { useState } from "react";

const tabs = [
  { id: "features", label: "Возможности", content: "Просмотр моделей и совместная работа.", disabled: false },
  { id: "integrations", label: "Интеграции", content: "Интеграции находятся в разработке.", disabled: true },
  { id: "security", label: "Безопасность", content: "Разграничение прав доступа.", disabled: false },
];
function TabButton({ tab, isActive, onSelect, onKeyDown }) {
  return (
    // Неактивные вкладки доступны стрелками; Tab фокусирует активную.
    <button type="button" id={`tab-${tab.id}`} role="tab"
      aria-selected={isActive} aria-controls={`panel-${tab.id}`}
      tabIndex={isActive ? 0 : -1} disabled={tab.disabled}
      onClick={() => onSelect(tab.id)} onKeyDown={onKeyDown}>
      {tab.label}
    </button>
  );
}
export default function ProductTabs() {
  const [activeTabId, setActiveTabId] = useState("features");
  // Объект и контент производны от ID: отдельное состояние не нужно.
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  function selectTab(id) {
    const selectedTab = tabs.find((tab) => tab.id === id);
    if (!selectedTab || selectedTab.disabled) return;
    setActiveTabId(id);
  }
  function handleKeyDown(event) {
    // Дополнение к исходному примеру: полноценная клавиатурная навигация.
    // Обработчик события может фокусировать DOM; render остаётся чистым.
    const enabled = tabs.filter((tab) => !tab.disabled);
    const index = enabled.findIndex((tab) => tab.id === activeTabId);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % enabled.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabled.length - 1;
    else return;
    event.preventDefault();
    const nextId = enabled[nextIndex].id;
    selectTab(nextId);
    // Ищем кнопку внутри текущего tablist, а не по всему документу.
    event.currentTarget.parentElement.querySelector(`#tab-${nextId}`).focus();
  }
  return (
    <section>
      <h1>Возможности продукта</h1>
      <div role="tablist" aria-label="Разделы продукта">
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} isActive={tab.id === activeTabId}
            onSelect={selectTab} onKeyDown={handleKeyDown} />
        ))}
      </div>
      {/* Все панели существуют: aria-controls всегда указывает на реальный ID.
          hidden оставляет видимой только активную панель. */}
      {tabs.map((tab) => (
        <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel"
          aria-labelledby={`tab-${tab.id}`} hidden={tab.id !== activeTabId} tabIndex={0}>
          <p>{tab.id === activeTabId ? activeTab?.content : tab.content}</p>
        </div>
      ))}
    </section>
  );
}
