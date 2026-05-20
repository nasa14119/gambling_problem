import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'div'>
export function NextCards({ ...rest }: Props) {
  return (
    <div className={cn(rest.className)}>
      <CardCover scale={1.2} />
    </div>
  )
}
