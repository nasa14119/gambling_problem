import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'div'>
const SCALE = 0.9
export function NextCards({ ...rest }: Props) {
  return (
    <div className={cn('relative mx-3', rest.className)}>
      <CardCover className="z-30" scale={SCALE} />
      <CardCover className="z-40 absolute -top-1 -left-1" scale={SCALE} />
      <CardCover className="z-50 absolute -top-2 -left-2" scale={SCALE} />
    </div>
  )
}
