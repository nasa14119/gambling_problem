import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'
import { cn } from '#/lib/utils'
import type { Card as CardType } from '@repo/types'
import type { ComponentProps } from 'react'

type Props = {
  table: null | (CardType | null)[]
  className?: ComponentProps<'div'>['className']
}
const SCALE = 1.7
export function Table({ table, className }: Props) {
  if (!table) {
    return (
      <div className={cn('flex gap-x-2', className)}>
        {Array.from({ length: 5 }, (_, i) => (
          <CardCover scale={SCALE} key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className={cn('flex gap-x-2', className)}>
      {table[0] ? (
        <Card card={table[0]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[1] ? (
        <Card card={table[1]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[2] ? (
        <Card card={table[2]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[3] ? (
        <Card card={table[3]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[4] ? (
        <Card card={table[4]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
    </div>
  )
}
