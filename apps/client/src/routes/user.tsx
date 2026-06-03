import { useAuth, useAuthValidate } from '#/components/Login/store'
import { UserPage } from '#/components/UserPage'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/user')({ component: User })

function User() {
  const { isLogged } = useAuth()
  const { navigate } = useRouter()
  useEffect(() => {
    if (!isLogged) {
      localStorage.removeItem('gameState')
      navigate({ to: '/login' })
      return
    }
  }, [isLogged])
  useAuthValidate()
  return (
    <>
      <UserPage />
    </>
  )
}
