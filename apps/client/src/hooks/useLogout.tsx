import { useAuthSetter } from '#/components/Login/store'
import { SERVER_PATH } from '#/env'
import { useRouter } from '@tanstack/react-router'

export const useLogout = () => {
  const setAuth = useAuthSetter()
  const { navigate } = useRouter()
  const handleLogout = () => {
    fetch(`${SERVER_PATH}/api/logout`, {
      credentials: 'include',
    })
      .then(() => {
        setAuth({ isLogged: false })
      })
      .then(() => {
        localStorage.removeItem('gameState')
      })
      .then(() => {
        navigate({ to: '/login' })
      })
  }
  return handleLogout
}
