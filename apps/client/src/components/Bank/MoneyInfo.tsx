import { cn, formatCurrency } from '#/lib/utils'
import type { ComponentProps, PropsWithChildren } from 'react'

type Props = ComponentProps<'div'> & PropsWithChildren

export function MoneyInfo({ className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'flex justify-start flex-col leading-8.75 size-full p-4 border-2 border-dashed rounded-xl border-current',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function MoneyInfoHeder({ className, children, ...rest }: Props) {
  return (
    <span className={cn('text-base font-semibold', className)} {...rest}>
      {children}
    </span>
  )
}

type PropsNumber = { value: number } & ComponentProps<'span'>

export function MoneyInfoNumber({
  className,
  children,
  value,
  ...rest
}: PropsNumber) {
  return (
    <span className={cn('ml-auto text-[5vh]', className)} {...rest}>
      {formatCurrency(value)}
    </span>
  )
}
