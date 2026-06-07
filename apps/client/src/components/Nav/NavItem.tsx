import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import type { ComponentProps, PropsWithChildren } from 'react'

type Props = {
  to: string
  type?: 'underline' | 'fill'
} & ComponentProps<'a'> &
  PropsWithChildren

export function NavItem({
  to,
  className,
  children,
  type = 'underline',
  ...rest
}: Props) {
  return (
    <Link
      className={cn(
        'text-xl leading-3 relative group text-accent',
        type === 'fill' && 'text-white bg-accent',
        className,
      )}
      to={to}
      {...rest}
    >
      {children}
      {type === 'underline' && (
        <span className="w-0 h-1 absolute -bottom-2 bg-accent group-hover:w-full left-0 rounded-4xl ease-in-out transform duration-200 "></span>
      )}
    </Link>
  )
}
