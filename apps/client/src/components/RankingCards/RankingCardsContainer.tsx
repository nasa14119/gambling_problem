import { cn } from '#/lib/utils'
import type { PropsWithChildren } from 'react'

export function RankingCardsContainer({
  className,
  children,
}: { className?: string } & PropsWithChildren) {
  return (
    <div
      className={cn(
        'absolute top-1/2 left-1/2 -translate-1/2 h-fit flex flex-col bg-slate-950 p-2 pt-4 rounded-sm shadow-2xl z-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
