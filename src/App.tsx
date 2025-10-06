import { useMemo, useState } from 'react'
import './App.css'

type SquareValue = 'X' | 'O' | null

type WinnerResult = {
  player: 'X' | 'O'
  line: [number, number, number]
} | null

function calculateWinner(squares: SquareValue[]): WinnerResult {
  const lines: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a]!, line: [a, b, c] }
    }
  }
  return null
}

function getMoveLocation(prev: SquareValue[], next: SquareValue[]): { row: number; col: number } | null {
  for (let i = 0; i < 9; i += 1) {
    if (prev[i] !== next[i]) {
      return { row: Math.floor(i / 3) + 1, col: (i % 3) + 1 }
    }
  }
  return null
}

function Square({ value, onClick, highlight }: { value: SquareValue; onClick: () => void; highlight: boolean }) {
  return (
    <button className={`square${highlight ? ' highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({ squares, onPlay, winningLine }: { squares: SquareValue[]; onPlay: (i: number) => void; winningLine: number[] }) {
  function renderSquare(i: number) {
    const isHighlighted = winningLine.includes(i)
    return <Square key={i} value={squares[i]} onClick={() => onPlay(i)} highlight={isHighlighted} />
  }

  const rows = []
  for (let r = 0; r < 3; r += 1) {
    const cells = []
    for (let c = 0; c < 3; c += 1) {
      const index = r * 3 + c
      cells.push(renderSquare(index))
    }
    rows.push(
      <div key={r} className="board-row">
        {cells}
      </div>,
    )
  }

  return <div>{rows}</div>
}

export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [isAscending, setIsAscending] = useState(true)

  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  const winnerInfo = useMemo(() => calculateWinner(currentSquares), [currentSquares])
  const isBoardFull = useMemo(() => currentSquares.every((s) => s !== null), [currentSquares])

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function handleClick(i: number) {
    if (currentSquares[i] || winnerInfo) return
    const nextSquares = currentSquares.slice() as SquareValue[]
    nextSquares[i] = xIsNext ? 'X' : 'O'
    handlePlay(nextSquares)
  }

  function jumpTo(move: number) {
    setCurrentMove(move)
  }

  const moves = history.map((squares, moveIdx) => {
    let description: string
    if (moveIdx === currentMove) {
      description = `You are at move #${moveIdx}`
    } else if (moveIdx > 0) {
      const location = getMoveLocation(history[moveIdx - 1], squares)
      const locationText = location ? ` (${location.row}, ${location.col})` : ''
      description = `Go to move #${moveIdx}${locationText}`
    } else {
      description = 'Go to game start'
    }

    return (
      <li key={moveIdx}>
        {moveIdx === currentMove ? (
          <span className="current-move">{description}</span>
        ) : (
          <button onClick={() => jumpTo(moveIdx)}>{description}</button>
        )}
      </li>
    )
  })

  const sortedMoves = isAscending ? moves : [...moves].reverse()

  let status: string
  if (winnerInfo) {
    status = `Winner: ${winnerInfo.player}`
  } else if (isBoardFull) {
    status = 'Draw: no winner'
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handleClick} winningLine={winnerInfo ? winnerInfo.line : []} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button className="sort" onClick={() => setIsAscending((v) => !v)}>
          Sort: {isAscending ? 'Ascending' : 'Descending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
}
