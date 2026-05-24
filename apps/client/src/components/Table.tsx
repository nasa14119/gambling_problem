import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'
import { NextCards } from '#/components/NextCards'
import { cn } from '#/lib/utils'
import type { Card as CardType } from '@repo/types'
import type { ComponentProps } from 'react'

type Props = {
  table: null | (CardType | null)[]
  className?: ComponentProps<'div'>['className']
  next?: boolean
  scale?: number
}
const SCALE = 1.3
export function Table({ table, className, scale = SCALE, next = true }: Props) {
  if (!table) {
    return (
      <div className={cn('flex gap-x-2 relative', className)}>
        {Array.from({ length: 5 }, (_, i) => (
          <CardCover scale={scale} key={i} />
        ))}
        {next && <NextCards className="absolute left-full bottom-0" />}
      </div>
    )
  }
  return (
    <div className={cn('flex gap-x-2 items-end relative', className)}>
      {table[0] ? (
        <Card card={table[0]} scale={scale} />
      ) : (
        <CardCover scale={scale} />
      )}
      {table[1] ? (
        <Card card={table[1]} scale={scale} />
      ) : (
        <CardCover scale={scale} />
      )}
      {table[2] ? (
        <Card card={table[2]} scale={scale} />
      ) : (
        <CardCover scale={scale} />
      )}
      {table[3] ? (
        <Card card={table[3]} scale={scale} />
      ) : (
        <CardCover scale={scale} />
      )}
      {table[4] ? (
        <Card card={table[4]} scale={scale} />
      ) : (
        <CardCover scale={scale} />
      )}
      {next && <NextCards className="absolute left-full" />}
    </div>
  )
}
