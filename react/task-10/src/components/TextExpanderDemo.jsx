import { useState } from "react";
function TextExpander({ text, limit = 100 }) {
  const [expanded, setExpanded] = useState(false);
  // Всё кроме флага выводится из props и state. Оригинальный текст не меняется.
  const needsTruncation = text.length > limit;
  const visibleText = needsTruncation && !expanded ? text.slice(0, limit) + "…" : text;
  return <div>
    <p>{visibleText}</p>
    {needsTruncation && <button type="button" aria-expanded={expanded}
      onClick={() => setExpanded((current) => !current)}>
      {expanded ? "Свернуть" : "Читать дальше"}
    </button>}
  </div>;
}
export default function TextExpanderDemo() {
  return <article>
    <h1>Обновление сайта</h1>
    {/* Постоянный текст: изменения props во время раскрытия в задачу не входят. */}
    <TextExpander text="Перед публикацией сайта важно проверить мобильную версию, работу ссылок и формы заявки. Такой список проверок помогает заметить ошибки до того, как страницу увидят посетители." />
  </article>;
}
