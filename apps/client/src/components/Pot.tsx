import { cn } from '#/lib/utils'
import { useGameState } from '#/stores/gameStore'

type PropsPotPlayer = {
  pot: number
  className?: string
  position: { top?: string; left?: string; right?: string; bottom?: string }
}
function PlayerPot({
  pot,
  className,
  position: { left = '', top = '', right = '', bottom = '' },
}: PropsPotPlayer) {
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-4xl absolute bg-yellow-300 text-green-950 text-xs',
        className,
      )}
      style={{ top, left, right, bottom }}
    >
      {pot}
    </div>
  )
}
const POSTIONS: Array<PropsPotPlayer['position']> = [
  { top: '40%', left: '20%' },
  { top: '40%', right: '20%' },
  { bottom: '40%', left: '25%' },
  { bottom: '40%', right: '25%' },
  { bottom: '30%', left: '50%' },
]
export function Pot() {
  const {
    turn,
    players,
    pot,
    user: { currentBet },
  } = useGameState()
  const keys = Object.keys(players)
  const pots = turn?.playersPots ?? {}
  return (
    <>
      <div className="absolute top-[40%] left-[48%] -translate-x-1/2 flex flex-col text-center">
        <div>Money Pot</div>
        <div>{pot ?? 0}</div>
      </div>
      {turn &&
        keys.map((key, i) => {
          if (!pots[key]) return null
          return <PlayerPot key={key} pot={pots[key]} position={POSTIONS[i]} />
        })}
      {currentBet && (
        <PlayerPot
          pot={currentBet}
          position={POSTIONS[4]}
          className="-translate-x-1/2"
        />
      )}
    </>
  )
}
