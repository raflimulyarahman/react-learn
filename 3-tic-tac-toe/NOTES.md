# Catatan Belajar: Tic-Tac-Toe React + TypeScript

Ringkasan konsep yang dipakai di `src/App.tsx`.

## Perintah harian
- `bun run dev` — jalankan dev server (Vite)
- `bunx tsc -b` — cek tipe TypeScript
- `bunx eslint src/App.tsx` — cek lint

## 1. useState
`const [nilai, setNilai] = useState(awal)`

State = "memori" komponen. Saat `setNilai` dipanggil dengan nilai baru, komponen render ulang.
Contoh: `const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))` -> papan 9 kotak, awalnya semua `null`.

## 2. Props: data turun vs event naik
- Data turun: parent kirim nilai -> `value={squares[0]}`
- Event naik: parent kirim fungsi -> `onSquareClick={() => handleClick(0)}`

Komponen anak (`Square`) tidak tahu logikanya; dia cuma "kalau diklik, jalankan fungsi ini".

## 3. `() => handleClick(0)` vs `handleClick(0)`
- `handleClick(0)` = **panggil sekarang**, hasilnya `void`. Salah -> error TS `Type 'void' is not assignable to type '() => void'`, dan bisa "Too many re-renders" karena setState jalan saat render.
- `() => handleClick(0)` = oper **fungsi** yang baru dijalankan saat diklik. Benar.

Aturan: kalau prop butuh fungsi tapi kamu ingin mengirim argumen, bungkus pakai arrow.

## 4. Lifting state up
State diangkat ke komponen induk terdekat yang butuh.
Di sini `squares` dulu tinggal di `Board`, sekarang pindah ke `Game` supaya `Game` bisa menyimpan riwayat (`history`).
`Board` jadi "bodoh": terima props `squares`, `xIsNext`, dan lapor perubahan lewat `onPlay`.

## 5. Immutability
Jangan ubah state langsung: `squares[i] = 'X'` (salah).
Copy dulu: `const nextSquares = squares.slice()`, baru ubah salinannya. React mendeteksi perubahan dari referensi array yang baru.

## 6. Representasi papan
Satu array 9 elemen, index:

```
0 1 2
3 4 5
6 7 8
```

## 7. calculateWinner
- `lines`: 8 kemungkinan menang (3 baris, 3 kolom, 2 diagonal), isinya index kotak.
- `const [a, b, c] = lines[i]` = destructuring, ambil 3 index dari satu baris `lines`.
- Syarat menang: `squares[a]` ada isinya (bukan `null`) DAN `squares[a] === squares[b] === squares[c]`.
- `return null` kalau tidak ada pemenang.

## 8. Tipe TypeScript penting
- `string | null` -> teks atau null
- `(string | null)[]` -> array dari tipe di atas (kurung wajib!)
- `interface SquareProps { value: string | null; onSquareClick: () => void }`
- `onPlay: (nextSquares: (string | null)[]) => void` -> fungsi yang menerima array, tidak mengembalikan apa pun
- `Array<(string | null)[]>` -> array-of-array; `history` berisi banyak versi papan

## 9. State turunan vs disimpan
`xIsNext` sebenarnya bisa diturunkan: `const xIsNext = currentMove % 2 === 0`.
Kalau disimpan sebagai state sendiri lalu di-update manual, ada dua sumber kebenaran yang bisa desinkron.

## 10. Time travel
- `history`: semua versi papan. `history[0]` = papan kosong.
- `currentMove`: indeks papan yang sedang dilihat. `currentSquares = history[currentMove]`.
- `jumpTo(n)`: pindah ke langkah ke-n.
- Saat langkah baru: `[...history.slice(0, currentMove + 1), nextSquares]` -> buang cabang lama, tambah papan baru.
- `key={move}` di list wajib unik supaya React tahu item mana yang mana.

## 11. Alur Git ke GitHub
1. Edit kode
2. `git add <file>` (stage)
3. `git commit -m "pesan"` (simpan ke repo lokal)
4. `git push` (ini yang bikin GitHub update)

GitHub tidak tahu apa pun sebelum `git push`.

## 12. Jurnal bug yang pernah kejadian
| Gejala | Penyebab | Obat |
|---|---|---|
| `Property 'onSquareClick' does not exist on type 'SquareProps'` | prop dipakai di komponen tapi belum ada di interface | tambahkan ke interface |
| `Type 'void' is not assignable to type '() => void'` | `onSquareClick={handleClick(0)}` (dipanggil, bukan dioper) | `={() => handleClick(0)}` |
| `Cannot find name 'squares'` | state sudah pindah ke `Game`, tapi `Board` masih memakainya | terima lewat props |
| `'setSquares' is declared but its value is never read` | variabel sengaja belum dipakai | rename `_setSquares` atau mulai pakai |
| Banyak `Expression expected` / `',' expected` | typo `=<`, seharusnya `=>` | perbaiki jadi `=>` |
| `Unexpected any` | `let status: any` | `let status: string` |
| `The value assigned to 'description' is not used` | `let` diisi `''` lalu ditimpa if/else | pakai ternary `const` |
| Papan tidak berubah saat klik "Go to move #N" | `currentSquares = history[history.length - 1]` | `history[currentMove]` |

## 13. Pola kunci yang perlu diingat
- State ada di satu tempat (single source of truth).
- Data turun lewat props, event naik lewat callback.
- Ubah state dengan membuat salinan baru (immutable).
- Nilai yang bisa dihitung sebaiknya diturunkan, jangan disimpan jadi state.
