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
  insuficientFunds?: boolean
} & ComponentProps<'button'>
export function Item({
  title,
  desc,
  price = 100,
  className,
  isAvailable = true,
  exploitId,
  insuficientFunds = false,
  onClick,
  ...rest
}: Props) {
  const [isLoading, setLoading] = useState(false)
  useExploitEventListener(({ eventId, payload }) => {
    if (eventId === 'exploit:invetory:add' && isLoading) {
      if (payload.exploit.exploitId !== exploitId) return
      setLoading(false)
    }
    if (eventId === 'buy:error') {
      if (payload.exploit !== exploitId) return
      setLoading(false)
      console.error(payload.error)
    }
  })
  const isDisable = !isAvailable || isLoading || insuficientFunds
  return (
    <button
      className={cn(
        'flex  hover:bg-current/10 transition-all duration-125 ease w-full justify-between items-center my-2 p-2 rounded-sm',
        className,
        isDisable && 'opacity-50 hover:bg-transparent',
      )}
      onClick={(e) => {
        onClick && onClick(e)
        if (isLoading) return
        setLoading(true)
      }}
      {...rest}
      disabled={isDisable}
    >
      <div className="flex flex-col text-sm px-2 text-left">
        <h3>{title}</h3>
        <div className="text-xs">{desc}</div>
      </div>
      <div className={cn('px-4', insuficientFunds && 'text-red-800 italic')}>
        {insuficientFunds ? 'insuficient fonds' : price}
      </div>
    </button>
  )
}
