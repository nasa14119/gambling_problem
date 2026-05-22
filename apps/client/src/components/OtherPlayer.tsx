import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { useIsActive } from '#/hooks/useIsActive'
import { usePlayerData } from '#/hooks/usePlayerData'
import { cn } from '#/lib/utils'
import type { PlayerHand } from '@repo/types'
import type { ComponentProps } from 'react'

type Props = {
  cards: PlayerHand
  hasError?: boolean
  isActive?: boolean
  playerId?: string
  isFold?: boolean
  chips?: number
} & ComponentProps<'div'>
export function OtherPlayer({ playerId, ...rest }: Props) {
  if (!playerId) return <OtherPlayerUI {...rest} cards={null} />
  return <OtherPlayerWithValue playerId={playerId} {...rest} />
}
type PropsWithValue = Omit<Props, 'playerId'> & { playerId: string }
function OtherPlayerWithValue({ playerId, ...rest }: PropsWithValue) {
  const userData = usePlayerData(playerId)
  const isActive = useIsActive(playerId)
  return (
    <OtherPlayerUI
      playerId={playerId}
      {...rest}
      {...userData}
      isActive={isActive}
    />
  )
}
export function OtherPlayerUI({
  cards,
  playerId,
  chips,
  isFold = false,
  isActive = false,
  ...rest
}: Props) {
  return (
    <div
      className={cn('flex flex-col relative min-w-fit', rest.className)}
      {...rest}
    >
      <PlayerCard
        cards={cards}
        scale={1.1}
        hasFold={isFold}
        isActive={isActive}
      />
      <div className="flex justify-between pt-2">
        <ChipsDisplay chips={chips} />
        <div className="bg-gray-300/20 py-2 px-3 rounded-4xl text-xs">
          {playerId}
        </div>
      </div>
    </div>
  )
}
