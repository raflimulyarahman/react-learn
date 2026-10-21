import type { GroceryItem } from "./App"

export default function Item({ item, onDeleteItem, onToggleItem }: { item: GroceryItem, onDeleteItem: (id: number) => void, onToggleItem: (id: number) => void }) {
    return (
        <li >
            <input type="checkbox" checked={item.checked} onChange={() => onToggleItem(item.id)} />
            <span style={item.checked ? { textDecoration: 'line-through' } : {}}>{item.quantity} {item.name}</span>
            <button onClick={() => onDeleteItem(item.id)}>&times;</button>
        </li>
    )
}