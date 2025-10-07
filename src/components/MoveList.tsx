interface MoveListProps {
  moves: React.ReactElement[]
}

export default function MoveList({ moves }: MoveListProps) {
  return <ol>{moves}</ol>
}
