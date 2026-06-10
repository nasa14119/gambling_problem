import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'
import { useStoreNextCard } from './NextCardInteface'
import { Card } from '#/components/Card'
import type { Card as TCard } from '@repo/types'
import { DisableIndicator } from './DisableIndicator'

type Props = ComponentProps<'div'>
const SCALE = 0.9
export function NextCards({ ...rest }: Props) {
  const { nextCard, isDisable } = useStoreNextCard((s) => s)
  return (
    <div className={cn('relative mx-3', rest.className)}>
      <Display className="z-30" scale={SCALE} card={nextCard} />
      <CardCover className="z-40 absolute -top-1 -left-1" scale={SCALE} />
      <CardCover className="z-50 absolute -top-2 -left-2" scale={SCALE} />
      {isDisable && (
        <DisableIndicator className="absolute -right-3 -bottom-3 z-50 " />
      )}
    </div>
  )
}

type PropsDisplay = Omit<ComponentProps<typeof Card>, 'card'> & {
  card: TCard | null
}
function Display({ card, ...rest }: PropsDisplay) {
  if (card) return <Card card={card} {...rest} />
  return <CardCover {...rest} />
}
