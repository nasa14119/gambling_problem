import { cn, formatCurrency, formatMinutes } from '#/lib/utils'
import type { RunsMetadataAdmin } from '@repo/types/db'
import styles from './adminView.module.css'
import { Empty } from '#/components/Leaderboard/Empty'

type Props = {
  data: RunsMetadataAdmin[] | null
  className?: string
}
export function TableRuns({ data, className }: Props) {
  if (!data || data.length <= 0) return <Empty />
  return (
    <div
      className={cn(
        'pr-5 max-h-full overflow-y-scroll relative scrollbar-thumb-accent scrollbar-track-transparent',
      )}
    >
      <header
        className={cn(
          'font-sans font-bold text-accent/90 text-xs sticky top-0 bg-background',
          styles['row'],
          className,
        )}
      >
        <div>#</div>
        <div>Level</div>
        <div>Player</div>
        <div>Time</div>
        <div>Money Win</div>
        <div>Money Spend</div>
        <div>Score</div>
        <div>Type End</div>
        <div>Still Running</div>
        <div>Started</div>
        <div>Ended</div>
        <div>Last Safe</div>
      </header>
      <main className={cn('text-md h-full', styles['table-best'], className)}>
        {data.map((iterarion, i) => (
          <div className={styles['row']} key={i}>
            <span>{iterarion.runId}</span>
            <span>{iterarion.level}</span>
            <span>{iterarion.username}</span>
            <span>{formatMinutes(iterarion.durationMinutes)}</span>
            <span>${formatCurrency(iterarion.moneyTotal)}</span>
            <span>${formatCurrency(iterarion.moneySpend)}</span>
            <span>${formatCurrency(iterarion.earnings)}</span>
            <span>{iterarion.typeEnd ?? 'N/A'}</span>
            <span>{iterarion.isRunning ? 'YES' : 'NO'}</span>
            <span className="text-xs">{iterarion.startedAt}</span>
            <span className="text-xs">{iterarion.endedAt ?? 'N/A'}</span>
            <span className="text-xs">{iterarion.lastSavedAt ?? 'N/A'}</span>
          </div>
        ))}
      </main>
    </div>
  )
}
