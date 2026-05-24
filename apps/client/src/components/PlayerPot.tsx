import { cn } from '#/lib/utils'
import { useGameState } from '#/stores/gameStore'
import type { ComponentProps } from 'react'

type Props = {
  playerId: string
  position?: 'left' | 'right'
} & ComponentProps<'div'>
export function PlayerPot({ playerId, className, position = 'right' }: Props) {
  const { turn } = useGameState()
  if (!turn) return null
  const pot = turn.playersPots[playerId] ?? 0
  return (
    <>
      {pot > 0 && (
        <div>
          <div
            className={cn(
              'px-4 mx-2 py-2 rounded-4xl absolute bg-yellow-300 text-green-950 text-xs',
              className,
              position === 'left' && 'bottom-0 right-full',
              position === 'right' && 'bottom-0 left-full',
            )}
          >
            {pot}
          </div>
        </div>
      )}
    </>
  )
}
