import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'

import type { Card as CardType, PlayerHand } from '@repo/types'
import type { PropsWithChildren } from 'react'

type Props = {
  cards?: PlayerHand
  isActive?: boolean
  hasError?: boolean
  scale?: number
  hasFold?: boolean
} & PropsWithChildren
export function PlayerCard({
  cards = null,
  isActive = false,
  children,
  hasError = false,
  scale = 1,
  hasFold = false,
}: Props) {
  const playerCards = cards as CardType[]
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-y-2 relative',
        hasFold && 'opacity-50',
      )}
    >
      {hasFold && (
        <div className="absolute inset-0 backdrop-grayscale-100 z-10 "></div>
      )}
      <div className="flex gap-x-2 ">
        {cards === null || playerCards.length < 2 ? (
          <>
            <CardCover scale={scale} />
            <CardCover scale={scale} />
          </>
        ) : (
          <>
            <Card
              card={cards[0]}
              scale={scale}
              className={[
                isActive && 'outline-2 outline-green-400',
                hasError && 'outline-2 outline-red-400',
              ]}
            />
            <Card
              card={cards[1]}
              scale={scale}
              className={[
                isActive && 'outline-2 outline-green-400',
                hasError && 'outline-2 outline-red-400',
              ]}
            />
          </>
        )}
      </div>
      {children}
    </div>
  )
}
