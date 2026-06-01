import { LoginMain } from '#/components/Login/LoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({ component: Home })

function Home() {
  return (
    <div>
      <LoginMain />
    </div>
  )
}
