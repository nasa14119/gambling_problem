import type { Card } from '@repo/types'
import type { ComponentProps } from 'react'
import { cn } from '#/utils'
import type { ClassValue } from 'clsx'

// Parameters recived for the component
type Props = {
  card: Card
  scale?: number
  className?: ClassValue
} & Omit<ComponentProps<'div'>, 'className'>
// constants of sprites dimetions
const CARD_WIDTH = 71,
  CARD_HEIGHT = 95
const SPRITE_WIDTH = 923,
  SPRITE_HEIGHT = 380

// Array to order the cards (most important for the last elements)
const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
// Get the card col and row
const CardCords = (card: Card) => {
  const [num, suit] = card.split('')
  const x = CARDS.indexOf(num)
  const y = { h: 0, c: 1, d: 2, s: 3 }[suit]
  return [x, y] as [number, number]
}
export function Card({ card, className, scale = 1, ...rest }: Props) {
  const [x, y] = CardCords(card)
  const top = -y * CARD_HEIGHT * scale
  const left = -x * CARD_WIDTH * scale
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
        src="../assets/spriteCard.png"
        width={SPRITE_WIDTH * scale}
        draggable={false}
        style={{
          left,
          top,
        }}
        height={SPRITE_HEIGHT * scale}
        className={`absolute [image-rendering:pixelated] object-contain max-w-none`}
        alt=""
      />
    </div>
  )
}
