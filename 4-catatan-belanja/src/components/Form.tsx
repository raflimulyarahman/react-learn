import { useState, type FormEvent } from "react";
import type { GroceryItem } from "../App";

export default function Form({ onAddItem }: { onAddItem: (item: GroceryItem) => void }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name) return;

    const newItem: GroceryItem = {
      id: Date.now(),
      name,
      quantity,
      checked: false,
    };

    onAddItem(newItem);

    setName('');
    setQuantity(1);
  }

  const quantityNum = [...Array(20)].map((_, i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Hari ini belanja apa kita?</h3>
      <div>
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {quantityNum}
        </select>
        <input type="text" placeholder="nama barang..." value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button type="submit">Tambah</button>
    </form>
  );
}