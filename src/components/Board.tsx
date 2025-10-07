import { Square, type SquareValue } from './Square'

interface BoardProps {
  squares: SquareValue[]
  onPlay: (i: number) => void
  winningLine: number[]
}

export default function Board({ squares, onPlay, winningLine }: BoardProps) {
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

  return <div className="game-board">{rows}</div>
}
