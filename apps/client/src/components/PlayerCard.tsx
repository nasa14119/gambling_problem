import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'

import type { PlayerHand } from '@repo/types'
import type { PropsWithChildren } from 'react'

type Props = {
  cards?: PlayerHand
  isActive?: boolean
  hasError?: boolean
  scale?: number
} & PropsWithChildren
export function PlayerCard({
  cards = null,
  isActive = false,
  children,
  hasError = false,
  scale = 1,
}: Props) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 relative">
      <div className="flex gap-x-2 ">
        {cards === null ? (
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
