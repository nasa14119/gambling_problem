import { PlayerCard } from '#/components/PlayerCard'
import type { PlayerHand } from '@repo/types'

type Props = {
  cards: PlayerHand
  isConnected: boolean
  hasError: boolean
  isActive: boolean
  placedBet: number
  playerMoney: { chips: number; money: number }
  playerId: string
}

export function PlayerCardUI({
  cards,
  isConnected,
  hasError,
  isActive,
  placedBet,
  playerMoney,
  playerId,
}: Props) {
  if (!isConnected) return null
  return (
    <PlayerCard cards={cards} isActive={isActive} hasError={hasError}>
      {placedBet > 0 && (
        <div className="absolute -top-2 -right-2 aspect-square grid place-content-center rounded-full w-8 bg-green-400 text-white text-xs">
          <span>{placedBet}</span>
        </div>
      )}
      <div className="flex justify-between *:py-2 *:px-2 *:rounded-4xl *:bg-gray-500/50 w-full gap-x-3">
        <span className="text-xs w-full text-center">{playerId}</span>
        <span className="text-[8px] flex gap-x-2 items-center min-w-max">
          <span>Money: {playerMoney.money}</span>
          <span>Chips: {playerMoney.chips}</span>
        </span>
      </div>
    </PlayerCard>
  )
}
