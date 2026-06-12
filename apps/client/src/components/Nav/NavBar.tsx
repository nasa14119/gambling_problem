import { NavItem } from '#/components/Nav/NavItem'
import { Right } from '#/components/Nav/Right'
import { cn } from '#/lib/utils'
import { useGameStore } from '#/stores/gameStore'
import type { ComponentProps } from 'react'

const LINKS = [
  { text: 'Home', to: '/' },
  { text: 'Leaderboard', to: '/leaderboard' },
  { text: 'Tutorial', to: '/tutorial' },
]

type Props = ComponentProps<'nav'>
export function NavBar({ className, ...rest }: Props) {
  const game = useGameStore((s) => s.gameState)
  return (
    <nav
      className={cn(
        'flex justify-between items-center py-2 px-5 bg-background',
        className,
      )}
      {...rest}
    >
      <div className="flex gap-x-5 ">
        {LINKS.map(({ text, to }) => (
          <NavItem key={text} to={to}>
            {text}
          </NavItem>
        ))}
        <NavItem to={game ? '/game' : '/login'}>Game</NavItem>
      </div>
      <Right />
    </nav>
  )
}
