import { useExploitEventListener } from '#/exploits/store'
import { cn } from '#/lib/utils'
import type { ExploitId } from '@repo/types/server'
import { useState } from 'react'
import type { ComponentProps } from 'react'

type Props = {
  id: ExploitId
  title: string
  desc: string
  price?: number
} & ComponentProps<'button'>
export function Item({
  id,
  title,
  desc,
  price = 100,
  className,
  onClick,
  ...rest
}: Props) {
  const [isLoading, setLoading] = useState(false)
  useExploitEventListener(({ eventId, payload }) => {
    if (eventId === 'buy:success' && isLoading) {
      if (payload.exploitId !== id) return
      setLoading(false)
    }
  })
  return (
    <button
      className={cn(
        'flex  hover:bg-current/10 transition-all duration-125 ease w-full justify-between items-center my-2 p-2 rounded-sm',
        className,
        isLoading && 'opacity-50',
      )}
      onClick={(e) => {
        onClick && onClick(e)
        if (isLoading) return
        setLoading(true)
      }}
      {...rest}
    >
      <div className="flex flex-col text-sm px-2 text-left">
        <h3>{title}</h3>
        <div className="text-xs">{desc}</div>
      </div>
      <div className="px-4">{price}</div>
    </button>
  )
}
