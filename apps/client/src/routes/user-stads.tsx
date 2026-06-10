import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user-stads')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user-stads"!</div>
}
