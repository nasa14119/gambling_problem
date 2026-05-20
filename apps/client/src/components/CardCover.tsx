import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'
import type { ClassValue } from 'clsx'
import cardCoverSprite from '#/assets/coverCardSprite.png'

const CARD_WIDTH = 71,
  CARD_HEIGHT = 95
const SPRITE_WIDTH = 497,
  SPRITE_HEIGHT = 475

type Props = {
  scale?: number
  className?: ClassValue
} & Omit<ComponentProps<'div'>, 'className'>
export function CardCover({ className, scale = 1, ...rest }: Props) {
  const left = 0
  const top = 0
  return (
    <div
      className={cn(
        `bg-white rounded-xl relative overflow-hidden border border-black/20`,
        className,
      )}
      style={{
        width: `${CARD_WIDTH * scale}px`,
        height: `${CARD_HEIGHT * scale}px`,
      }}
      {...rest}
    >
      <img
        src={cardCoverSprite}
        width={SPRITE_WIDTH * scale}
        style={{
          left,
          top,
        }}
        draggable={false}
        height={SPRITE_HEIGHT * scale}
        className={`absolute [image-rendering:pixelated] object-contain max-w-none`}
        alt=""
      />
    </div>
  )
}
