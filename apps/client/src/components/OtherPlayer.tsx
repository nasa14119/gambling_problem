import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { PlayerPot } from '#/components/PlayerPot'
import { usePlayerData } from '#/hooks/usePlayerData'
import { cn } from '#/lib/utils'
import type { PlayerHand } from '@repo/types'
import type { ComponentProps } from 'react'

type PropsUI = {
  playerId?: string
  cards: PlayerHand
  chips: number
  isFold?: boolean
  isActive?: boolean
  position?: 'left' | 'right'
} & ComponentProps<'div'>
type Props = Partial<PropsUI>
export function OtherPlayer({ playerId, ...rest }: Props) {
  if (!playerId) return <OtherPlayerUI {...rest} cards={null} chips={0} />
  return <OtherPlayerWithValue playerId={playerId} {...rest} />
}

type PropsWithValue = Omit<PropsUI, 'playerId' | 'cards' | 'chips'> & {
  playerId: string
}
function OtherPlayerWithValue({ playerId, ...rest }: PropsWithValue) {
  const userData = usePlayerData(playerId)
  return <OtherPlayerUI {...rest} {...userData} />
}

export function OtherPlayerUI({
  cards,
  playerId = 'disconected',
  chips,
  isFold = false,
  isActive = false,
  position = 'right',
  ...rest
}: PropsUI) {
  return (
    <div
      className={cn('flex flex-col relative min-w-fit', rest.className)}
      {...rest}
    >
      <PlayerCard
        cards={cards}
        scale={1}
        hasFold={isFold}
        isActive={isActive}
      />
      <div className="flex justify-between pt-2 relative">
        <ChipsDisplay chips={chips} />
        <div className="bg-gray-300/20 py-2 px-3 rounded-4xl text-xs">
          {playerId}
        </div>
        <PlayerPot playerId={playerId} position={position} />
      </div>
    </div>
  )
}
