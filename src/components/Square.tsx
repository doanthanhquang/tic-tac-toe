type SquareValue = 'X' | 'O' | null

interface SquareProps {
  value: SquareValue
  onClick: () => void
  highlight: boolean
}

export function Square({ value, onClick, highlight }: SquareProps) {
  return (
    <button className={`square${highlight ? ' highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

export type { SquareValue }
