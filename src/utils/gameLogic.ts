import { type SquareValue } from '../components/Square'

export type WinnerResult = {
  player: 'X' | 'O'
  line: [number, number, number]
} | null

export function calculateWinner(squares: SquareValue[]): WinnerResult {
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

export function getMoveLocation(prev: SquareValue[], next: SquareValue[]): { row: number; col: number } | null {
  for (let i = 0; i < 9; i += 1) {
    if (prev[i] !== next[i]) {
      return { row: Math.floor(i / 3) + 1, col: (i % 3) + 1 }
    }
  }
  return null
}
