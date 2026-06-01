import { useAuth } from '#/components/Login/store'
import { UserPage } from '#/components/UserPage'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({ component: User })

function User() {
  const auth = useAuth()
  const { navigate } = useRouter()
  if (!auth.isLogged) {
    navigate({ to: '/login' })
    return
  }
  return (
    <>
      <UserPage />
    </>
  )
}
