import { cn } from '#/lib/utils'
import type { TurnOptions } from '@repo/types'
import type { ComponentProps } from 'react'

export function Option({
  value,
  className,
  ...rest
}: { value: string } & ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-gray-300/20 p-0.5 px-3 rounded-4xl flex gap-x-2 text-xs text-center justify-center capitalize font-medium',
        className,
      )}
      {...rest}
    >
      {value}
    </div>
  )
}
export function Options({
  minBet,
  setOpt,
  currentBet,
  isInvalid = false,
  chips = Infinity,
}: {
  minBet: number | null
  setOpt: (key: TurnOptions) => void
  currentBet: number
  isInvalid?: boolean
  chips?: number
}) {
  const isAll = chips - currentBet === 0 && currentBet > 0
  const isPay = currentBet === minBet && minBet > 0 && !isAll
  return (
    <>
      {minBet !== null && !isInvalid && (
        <>
          {isPay && (
            <Option
              value="pay"
              className="bg-blue-500/70"
              onClick={() => setOpt('pay')}
            />
          )}
          {isAll && currentBet >= minBet && (
            <Option
              value="All in"
              className="bg-green-400/70"
              onClick={() => setOpt(currentBet > minBet ? 'raise' : 'pay')}
            />
          )}
          {currentBet > minBet && !isAll && (
            <Option
              value="raise"
              className="bg-green-500/70"
              onClick={() => setOpt('raise')}
            />
          )}
          {minBet === 0 && (
            <Option
              value="check"
              className="bg-yellow-500"
              onClick={() => setOpt('check')}
            />
          )}
        </>
      )}
      <Option
        value="fold"
        className="bg-red-500/70"
        onClick={() => setOpt('fold')}
      />
    </>
  )
}
