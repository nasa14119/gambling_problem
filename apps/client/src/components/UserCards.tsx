import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { useIsActive } from '#/hooks/useIsActive'
import { useUserEvents } from '#/hooks/useUserEvents'
import { useGameState } from '#/stores/gameStore'

export function UserCards() {
  const { user } = useGameState()
  useUserEvents({ playerId: user.playerId })
  const isActive = useIsActive(user.playerId)
  return (
    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-x-2 items-end">
      <PlayerCard
        cards={user.cards}
        scale={1.5}
        hasFold={user.isFold}
        isActive={isActive}
      />
      <ChipsDisplay chips={user.chips} />
    </div>
  )
}
