import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'div'>
export function NextCards({ ...rest }: Props) {
  return (
    <div className={cn('relative', rest.className)}>
      <CardCover className="z-50" scale={1.2} />
      <CardCover className="z-40 absolute top-1 -right-1" scale={1.2} />
      <CardCover className="z-30 absolute top-2 -right-2" scale={1.2} />
    </div>
  )
}
