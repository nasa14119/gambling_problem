import { MainLeaderboard } from '#/components/Leaderboard/MainLeaderboard'
import { Sidebar } from '#/components/Leaderboard/Sidebar'
import { NavBar } from '#/components/Nav/NavBar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/leaderboard')({ component: Leaderboard })

export function Leaderboard() {
  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden">
      <NavBar />
      <h1 className="text-6xl font-semibold pl-4 pt-2 tracking-widest uppercase">
        Leaderboard
      </h1>
      <div className="grid grid-rows-1 grid-cols-[1fr_3fr] h-full">
        <Sidebar />
        <MainLeaderboard />
      </div>
    </main>
  )
}
