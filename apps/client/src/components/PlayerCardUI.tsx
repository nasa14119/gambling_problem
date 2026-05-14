import { PlayerCard } from '#/components/PlayerCard'
import type { PlayerHand } from '@repo/types'

type Props = {
  cards: PlayerHand
  isConnected: boolean
  hasError: boolean
  isActive: boolean
  placedBet: number
}

export function PlayerCardUI({
  cards,
  isConnected,
  hasError,
  isActive,
  placedBet,
}: Props) {
  if (!isConnected) return null
  return (
    <PlayerCard cards={cards} isActive={isActive} hasError={hasError}>
      {placedBet > 0 && (
        <div className="absolute bottom-0 left-0 aspect-square grid place-content-center rounded-full w-10 bg-green-400 text-white">
          <span>{placedBet}</span>
        </div>
      )}
    </PlayerCard>
  )
}
