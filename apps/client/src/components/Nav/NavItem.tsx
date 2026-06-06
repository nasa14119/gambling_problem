import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'

type Props = {
  text: string
  to: string
  type?: 'underline' | 'fill'
} & ComponentProps<'a'>

export function NavItem({
  to,
  text,
  className,
  type = 'underline',
  ...rest
}: Props) {
  return (
    <Link
      className={cn(
        'text-xl leading-3 relative group',
        type === 'fill' && 'text-white bg-accent',
        className,
      )}
      to={to}
      {...rest}
    >
      {text}
      {type === 'underline' && (
        <span className="w-0 h-1 absolute -bottom-2 bg-accent group-hover:w-full left-0 rounded-4xl ease-in-out transform duration-200 "></span>
      )}
    </Link>
  )
}
