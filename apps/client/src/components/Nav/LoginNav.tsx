import { useAuth } from '#/components/Login/store'
import { NavItem } from '#/components/Nav/NavItem'
import { IdCard } from 'lucide-react'

export function Login() {
  const { isLogged, playerId = 'user' } = useAuth()
  const text = isLogged ? playerId! : 'login'
  return (
    <NavItem to={isLogged ? '/user' : '/login'}>
      <span className="flex gap-x-2 items-center text-xl">
        <span>{text}</span>
        <IdCard className="size-7" />
      </span>
    </NavItem>
  )
}
