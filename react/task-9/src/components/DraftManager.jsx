import { useState } from "react";
const initialArticles = [
  {id:1,title:"Обзор продукта"},{id:2,title:"Новости команды"},{id:3,title:"Инструкция по настройке"},
];
export default function DraftManager() {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedIds, setSelectedIds] = useState([]);
  // Пустой список не считается полностью выбранным: 0 === 0 недостаточно.
  const allSelected = articles.length > 0 && selectedIds.length === articles.length;
  function toggleArticle(id) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id) : [...current, id]);
  }
  function selectAll(event) {
    // Для checkbox читаем checked, а не строковое value.
    setSelectedIds(event.target.checked ? articles.map((item) => item.id) : []);
  }
  function deleteSelected() {
    if (selectedIds.length === 0) return;
    // Новый массив содержит только невыбранные карточки.
    setArticles((current) => current.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]); // Удалённых ID больше нет в выборе.
  }
  return <section>
    <h1>Черновики статей</h1>
    <label><input type="checkbox" checked={allSelected} disabled={articles.length === 0}
      onChange={selectAll} />Выбрать все</label>
    <p>Выбрано: {selectedIds.length}</p>
    <button type="button" disabled={selectedIds.length === 0} onClick={deleteSelected}>Удалить выбранные</button>
    {articles.length === 0 ? <p>Черновиков нет</p> : <ul>
      {articles.map((article) => <li key={article.id}>
        <label><input type="checkbox" checked={selectedIds.includes(article.id)}
          onChange={() => toggleArticle(article.id)} />{article.title}</label>
      </li>)}
    </ul>}
  </section>;
}
