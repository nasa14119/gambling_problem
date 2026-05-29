import { cn, formatChips, formatCurrency } from '#/lib/utils'
import { Coins, DollarSign } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentProps } from 'react'

type Props = {
  type: 'money' | 'chips'
  error?: boolean
} & ComponentProps<'input'>
export function Pill({
  className,
  type,
  disabled,
  error = false,
  value,
  ...rest
}: Props) {
  const valueFormat =
    Number.isNaN(value) || typeof value !== 'number'
      ? 0
      : type === 'money'
        ? formatCurrency(value)
        : formatChips(value)
  const Icons = ({ ...props }: LucideProps) =>
    type === 'money' ? <DollarSign {...props} /> : <Coins {...props} />
  return (
    <div
      className={cn(
        'bg-current/20 px-4 py-2 rounded-2xl text-center w-full',
        className,
        error && 'outline outline-red-700 outline-dashed',
      )}
    >
      <span className="grid grid-cols-[auto_1fr] items-center">
        <Icons className="size-5" />
        {disabled ? (
          <div className="text-start">{valueFormat}</div>
        ) : (
          <input
            className={'focus:outline-0 w-full'}
            min={0}
            placeholder={type === 'money' ? 'money' : 'chips'}
            {...rest}
          />
        )}
      </span>
    </div>
  )
}
