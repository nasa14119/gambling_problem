import type { PropsWithChildren } from 'react'
import type { States } from '../store.ts'

import { useChangeState } from '../store'
import { cn } from '#/lib/utils.ts'

type Props = {
  state: States
  className?: string
} & PropsWithChildren

export function StateBtn({ state, className, children }: Props) {
  const { isActive, setState } = useChangeState(state)
  return (
    <button
      className={cn(
        `${isActive ? 'bg-accent text-white' : 'text-accent'} border border-accent rounded-full px-2 py-1 text-md`,
        className,
      )}
      onClick={setState}
      type="button"
      disabled={isActive}
    >
      {children}
    </button>
  )
}
