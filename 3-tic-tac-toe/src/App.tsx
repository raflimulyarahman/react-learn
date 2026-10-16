// useState = "memori" komponen. Nilainya berubah -> komponen render ulang.
import { useState } from 'react'

interface SquareProps {
  value: string | null // data turun: isi kotak ('X' | 'O' | null)
  onSquareClick: () => void // event naik: fungsi dari parent, dijalankan saat tombol diklik
}

interface BoardProps {
  xIsNext: boolean // true = giliran X
  squares: (string | null)[] // papan: array 9 elemen
  onPlay: (nextSquares: (string | null)[]) => void // lapor papan baru ke Game
}

// Komponen "bodoh": tidak punya state. Tugasnya cuma tampilkan value + teruskan klik.
function Square({ value, onSquareClick }: SquareProps) {
  return <button className='square' onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}: BoardProps) {
  function handleClick(i: number) {
    // Guard: jangan timpa kotak yang sudah terisi / jangan main setelah ada pemenang.
    if(squares[i] || calculateWinner(squares)) return
    // Copy dulu (immutability): ubah salinannya, bukan state aslinya.
    const nextSquares = squares.slice()

    nextSquares[i] = xIsNext ? 'X' : 'O'

    // Bukan setState di sini: state ada di Game, jadi lapor lewat callback onPlay.
    onPlay(nextSquares)
  }

  // Status diturunkan setiap render dari data, tidak disimpan di state.
  const winner = calculateWinner(squares)
  let status: string
  if(winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }
  return (
    <>
    <div className='status'>{status}</div>
    <div className='board'>
      {/* onClick={handleClick(0)} akan dipanggil saat render (salah). Bungkus dengan arrow () => ... supaya baru dipanggil saat diklik. */}
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
    </>
  )
}

function Game() {
  // Source of truth: history (semua versi papan) + currentMove (indeks yang sedang dilihat).
  const [xIsNext, setXIsNext] = useState(true)
  const [history, setHistory] = useState<Array<(string | null)[]>>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove]

  // Time travel: pindah ke langkah ke-N.
  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }
  
  function handlePlay(nextSquares: (string | null)[]) {
    // Buang langkah setelah currentMove, lalu tambahkan papan baru di akhir.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
  }

  // map -> daftar tombol langkah. key wajib unik supaya React tahu item mana yang mana.
  const moves = history.map((_, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
    
  })
  return (
    <div className='game'>
      <div>
      {/* Data turun ke Board: papan aktif, giliran, dan callback onPlay. */}
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]) {
  // 8 cara menang. Tiap baris isinya index kotak (0..8): 3 baris, 3 kolom, 2 diagonal.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for(let i = 0; i < lines.length; i++) {
    // Destructuring: a, b, c = 3 index kotak yang sedang dicek.
    const [a, b, c] = lines[i]
    // squares[a] harus ada isinya (bukan null) DAN ketiganya sama.
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null // tidak ada pemenang
}

export default Game
