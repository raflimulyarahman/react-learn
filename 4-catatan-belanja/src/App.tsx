import { useState } from "react";

const groceryItems = [
  {
    id: 1,
    name: 'Kopi Bubuk',
    quantity: 2,
    checked: true,
  },
  {
    id: 2,
    name: 'Gula Pasir',
    quantity: 5,
    checked: false,
  },
  {
    id: 3,
    name: 'Air Mineral',
    quantity: 3,
    checked: false,
  },
];


type GroceryItem = (typeof groceryItems)[number];

export default function App() {
  const [items, setItems] = useState<GroceryItem[]>(groceryItems);

  function handleAddItem(item: GroceryItem) {
    setItems((prevItems) => [...prevItems, item]);
  }

  function handleDeleteItem(id: number) {
    setItems((items) => items.filter((item) => item.id !== id))
  }

  function handleToggleItem(id: number) {
    setItems(items.map((item) => (item.id === id ? {...item, checked: !item.checked} : item)))
  }

  function handleClearItems() {
    setItems([])
  }

  return (
    <div className="app">
      <Header />
      <Form onAddItem={handleAddItem} />
      <GroceryList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} onClearItems={handleClearItems} />
      <Footer items={items} />
    </div>
  );
}

function Header() {
  return <h1>Catatan Belanjaku 📝</h1>;
}

function Form({ onAddItem }: { onAddItem: (item: GroceryItem) => void }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

function GroceryList({ items, onDeleteItem, onToggleItem, onClearItems }: { items: GroceryItem[], onDeleteItem: (id: number) => void, onToggleItem: (id: number) => void, onClearItems: () => void }) {

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

function Item({ item, onDeleteItem, onToggleItem }: { item: GroceryItem, onDeleteItem: (id: number) => void, onToggleItem: (id: number) => void }) {
  return (
    <li >
      <input type="checkbox" checked={item.checked} onChange={() => onToggleItem(item.id)} />
      <span style={item.checked ? { textDecoration: 'line-through' } : {}}>{item.quantity} {item.name}</span>
      <button onClick={() => onDeleteItem(item.id)}>&times;</button>
    </li>
  )
}

function Footer({ items }: {items: GroceryItem[]}) {

const totalItems = items.length;
const checkedItems = items.filter((i) => i.checked).length;
const precentage = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

  return <footer className="stats">Ada {totalItems} barang di daftar belanjaan, {checkedItems} barang sudah dibeli ({precentage})</footer>
}