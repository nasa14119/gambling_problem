import { NavItem } from '#/components/Nav/NavItem'
import { Right } from '#/components/Nav/Right'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'

const LINKS = [
  { text: 'Home', to: '/' },
  { text: 'Leaderboard', to: '/leaderboard' },
  { text: 'Game', to: '/game' },
]

type Props = ComponentProps<'nav'>
export function NavBar({ className, ...rest }: Props) {
  return (
    <nav
      className={cn(
        'flex justify-between items-center py-2 px-2 bg-background',
        className,
      )}
      {...rest}
    >
      <div className="flex gap-x-5 ">
        {LINKS.map(({ text, to }) => (
          <NavItem key={text} text={text} to={to} />
        ))}
      </div>
      <Right />
    </nav>
  )
}
