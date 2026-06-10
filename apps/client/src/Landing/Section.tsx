import { cn } from '#/lib/utils'
import type { PropsWithChildren } from 'react'
import styles from './landing.module.css'

type Props = {
  side?: 'right' | 'left' | 'center'
  className?: string
  title: string
} & PropsWithChildren
export function Section({ side = 'right', title, children, className }: Props) {
  return (
    <section className={'flex flex-col'}>
      <h3
        className={cn(
          'text-7xl px-[5%] font-semibold font-sans uppercase tracking-[-2px]',
          side === 'right' ? 'text-right' : 'text-left',
          side === 'center' && 'text-center',
          styles['title-animation'],
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          'grid auto-rows-fr grid-cols-12 h-full px-[5%] py-10',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
