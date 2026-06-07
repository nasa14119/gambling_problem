import { useAuth } from '#/components/Login/store'
import { cn, formatCurrency, formatMinutes } from '#/lib/utils'
import type { RunStats } from '@repo/types/db'
import { useBestRunUserData } from './store.ts'
import styles from '../styles.module.css'

const EMPTY_USER: Omit<RunStats, 'username'> = {
  timePlayed: 0,
  moneyTotal: 0,
  moneySpend: 0,
  earnings: 0,
  mostUsedExploit: null,
}
export function UserRow() {
  const { isLogged } = useAuth()
  const userData = useBestRunUserData()
  const data = userData ?? EMPTY_USER
  if (!isLogged) return null
  return (
    <div
      className={cn(
        'bg-accent/10 py-1 pr-5 rounded-xs text-accent',
        styles['row'],
      )}
    >
      <span>#</span>
      <span>Your Best Score</span>
      <span>{formatMinutes(data.timePlayed)}</span>
      <span>{data.mostUsedExploit ?? 'No exploit used'}</span>
      <span>${formatCurrency(data.moneyTotal)}</span>
      <span>${formatCurrency(data.moneySpend)}</span>
      <span>${formatCurrency(data.earnings)}</span>
    </div>
  )
}
