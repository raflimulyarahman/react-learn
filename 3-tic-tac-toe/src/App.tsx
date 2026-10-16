import { useState } from 'react'

interface SquareProps {
  value: string | null
  onSquareClick: () => void
}

interface BoardProps {
  xIsNext: boolean
  squares: (string | null)[]
  onPlay: (nextSquares: (string | null)[]) => void
}

function Square({ value, onSquareClick }: SquareProps) {
  return <button className='square' onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}: BoardProps) {
  function handleClick(i: number) {
    if(squares[i] || calculateWinner(squares)) return
    const nextSquares = squares.slice()

    nextSquares[i] = xIsNext ? 'X' : 'O'

    onPlay(nextSquares)
  }

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

  const [xIsNext, setXIsNext] = useState(true)
  const [history, setHistory] = useState<Array<(string | null)[]>>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove]

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }
  
  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
  }

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
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]) {
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
    const [a, b, c] = lines[i]
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Game
