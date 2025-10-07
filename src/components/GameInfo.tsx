import MoveList from './MoveList'

interface GameInfoProps {
  status: string
  moves: React.ReactElement[]
  isAscending: boolean
  onToggleSort: () => void
}

export default function GameInfo({ status, moves, isAscending, onToggleSort }: GameInfoProps) {
  return (
    <div className="game-info">
      <div className="status">{status}</div>
      <button className="sort" onClick={onToggleSort}>
        Sort: {isAscending ? 'Ascending' : 'Descending'}
      </button>
      <MoveList moves={moves} />
    </div>
  )
}
