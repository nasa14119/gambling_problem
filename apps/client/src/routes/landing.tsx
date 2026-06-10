import { Landing } from '#/Landing/Landing'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landing')({
  component: Landing,
})
