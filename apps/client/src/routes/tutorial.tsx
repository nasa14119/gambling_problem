import { NavBar } from '#/components/Nav/NavBar'
import { Tutorial } from '#/components/Tutorial/Tutorial'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tutorial')({
  component: TutorialPage,
})

function TutorialPage() {
  return (
    <main className="h-screen w-screen grid grid-cols-1 grid-rows-[auto_auto_1fr]">
      <NavBar />
      <h1 className="text-7xl font-sans uppercase px-4">Tutorial</h1>
      <Tutorial />
    </main>
  )
}
