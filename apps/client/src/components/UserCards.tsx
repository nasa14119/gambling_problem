import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'

export function UserCards() {
  return (
    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-x-2 items-end">
      <PlayerCard cards={null} scale={1.5} />
      <ChipsDisplay />
    </div>
  )
}
