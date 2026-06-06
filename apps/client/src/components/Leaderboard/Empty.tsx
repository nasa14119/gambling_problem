import { cn } from '#/lib/utils'
import { DatabaseBackup } from 'lucide-react'
import styles from './styles.module.css'

export function Empty() {
  return (
    <div
      className={cn(
        'size-full text-2xl  flex items-center justify-center flex-col bg-slate-800/20 rounded-4xl',
        styles['table-empty'],
      )}
    >
      <DatabaseBackup className="size-10 text-gray-700" />
      <span>No records found</span>
    </div>
  )
}
