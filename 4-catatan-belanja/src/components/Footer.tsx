import type { GroceryItem } from "./App";

export default function Footer({ items }: { items: GroceryItem[] }) {

    const totalItems = items.length;
    const checkedItems = items.filter((i) => i.checked).length;
    const precentage = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

    return <footer className="stats">Ada {totalItems} barang di daftar belanjaan, {checkedItems} barang sudah dibeli ({precentage})</footer>
}