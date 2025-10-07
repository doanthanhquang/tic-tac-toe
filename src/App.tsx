import { useMemo, useState } from 'react'
import './App.css'
import Board from './components/Board'
import GameInfo from './components/GameInfo'
import type { SquareValue } from './components/Square'
import { calculateWinner, getMoveLocation } from './utils/gameLogic'

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
      <Board squares={currentSquares} onPlay={handleClick} winningLine={winnerInfo ? winnerInfo.line : []} />
      <GameInfo 
        status={status} 
        moves={sortedMoves} 
        isAscending={isAscending} 
        onToggleSort={() => setIsAscending((v) => !v)} 
      />
    </div>
  )
}
