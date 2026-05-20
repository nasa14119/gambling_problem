import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { cn } from '#/lib/utils'
import type { PlayerHand } from '@repo/types'
import type { ComponentProps } from 'react'

type Props = {
  cards: PlayerHand
  hasError?: boolean
  isActive?: boolean
  playerMoney?: { chips: number; money: number }
  placedBet?: number
  playerId: string
} & ComponentProps<'div'>
export function OtherPlayer({ cards, playerMoney, playerId, ...rest }: Props) {
  return (
    <div
      className={cn('flex flex-col relative min-w-fit', rest.className)}
      {...rest}
    >
      <PlayerCard cards={cards} scale={1.1} />
      <div className="flex justify-between pt-2">
        <ChipsDisplay />
        <div className="bg-gray-300/20 py-2 px-3 rounded-4xl text-xs">
          {playerId}
        </div>
      </div>
    </div>
  )
}
