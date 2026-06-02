import { useExploitEventListener } from '#/exploits/store'
import { cn } from '#/lib/utils'
import type { ExploitId } from '@repo/types'
import { useState } from 'react'
import type { ComponentProps } from 'react'

type Props = {
  exploitId: ExploitId
  title: string
  desc: string
  price?: number
  isAvailable?: boolean
} & ComponentProps<'button'>
export function Item({
  id,
  title,
  desc,
  price = 100,
  className,
  isAvailable = true,
  onClick,
  ...rest
}: Props) {
  const [isLoading, setLoading] = useState(false)
  useExploitEventListener(({ eventId, payload }) => {
    if (eventId === 'buy:success' && isLoading) {
      if (payload.exploit.exploitId !== id) return
      setLoading(false)
    }
  })
  return (
    <button
      className={cn(
        'flex  hover:bg-current/10 transition-all duration-125 ease w-full justify-between items-center my-2 p-2 rounded-sm',
        className,
        (isLoading || !isAvailable) && 'opacity-50 hover:bg-transparent',
      )}
      onClick={(e) => {
        onClick && onClick(e)
        if (isLoading) return
        setLoading(true)
      }}
      {...rest}
      disabled={!isAvailable || isLoading}
    >
      <div className="flex flex-col text-sm px-2 text-left">
        <h3>{title}</h3>
        <div className="text-xs">{desc}</div>
      </div>
      <div className="px-4">{price}</div>
    </button>
  )
}
