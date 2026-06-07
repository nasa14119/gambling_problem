import { cn } from '#/lib/utils'
import styles from '../styles.module.css'

export function UserRow() {
  return (
    <div
      className={cn(
        'bg-accent/20 py-1 pr-5 rounded-xs text-accent',
        styles['row'],
      )}
    >
      <span>#</span>
      <span>Your Best Score</span>
      <span>0:00</span>
      <span>No exploit used</span>
      <span>$0</span>
      <span>$0</span>
      <span>$0</span>
    </div>
  )
}
