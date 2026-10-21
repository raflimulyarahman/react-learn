import { useState } from "react";
import type { GroceryItem } from "../App";
import Item from "./Item";

export default function GroceryList({ items, onDeleteItem, onToggleItem, onClearItems }: { items: GroceryItem[], onDeleteItem: (id: number) => void, onToggleItem: (id: number) => void, onClearItems: () => void }) {

  const [sortBy, setSortBy] = useState('input')

  let sortedItems: any[];

  switch (sortBy) {
    case 'input':
      sortedItems = items;
      break;
    case 'name':
      sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'checked':
      sortedItems = [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
      break;
    default:
      sortedItems = items;
  }

  // if (sortBy === 'input') {
  //   sortedItems = items;
  // } else if (sortBy === 'name') {
  //   sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
  // } else if (sortBy === 'checked') {
  //   sortedItems = [...items].sort((a, b) => Number(b.checked) - Number(a.checked));
  // }

  return (
    <>
      <div className="list">
        <ul>
          {sortedItems?.map((item) => (
            <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
          ))}
        </ul>
      </div>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Urutkan berdasarkan urutan input</option>
          <option value="name">Urutkan berdasarkan nama barang</option>
          <option value="checked">Urutkan berdasarkan ceklis</option>
        </select>
        <button onClick={onClearItems}>Bersihkan Daftar</button>
      </div>
    </>
  );
}