import { cn, formatCurrency, formatMinutes } from '#/lib/utils'
import type { RunStats } from '@repo/types/db'
import styles from '../styles.module.css'

type Props = {
  data: RunStats[]
}
export function TableBestUI({ data }: Props) {
  return (
    <div
      className={cn(
        'pr-5  max-h-full overflow-y-scroll relative scrollbar-thumb-accent scrollbar-track-transparent',
      )}
    >
      <header
        className={cn(
          'font-sans  font-bold text-accent/90 text-xs sticky top-0 bg-background',
          styles['row'],
        )}
      >
        <div>#</div>
        <div>Player</div>
        <div>Time</div>
        <div>Favorite Exploit</div>
        <div>Money Win</div>
        <div>Money Spend</div>
        <div>Score</div>
      </header>
      <main className={cn('text-md h-full', styles['table-best'])}>
        {data.map((iterarion, i) => (
          <div className={styles['row']} key={i}>
            <span>{i + 1}</span>
            <span>{iterarion.username}</span>
            <span>{formatMinutes(iterarion.timePlayed)}</span>
            <span>{iterarion.mostUsedExploit ?? 'No exploit used'}</span>
            <span>${formatCurrency(iterarion.moneyTotal)}</span>
            <span>${formatCurrency(iterarion.moneySpend)}</span>
            <span>${formatCurrency(iterarion.earnings)}</span>
          </div>
        ))}
      </main>
    </div>
  )
}
