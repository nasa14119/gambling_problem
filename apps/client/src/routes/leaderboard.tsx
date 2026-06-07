import { MainLeaderboard } from '#/components/Leaderboard/MainLeaderboard'
import { Sidebar } from '#/components/Leaderboard/Sidebar'
import { useAuthValidate } from '#/components/Login/store'
import { NavBar } from '#/components/Nav/NavBar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/leaderboard')({ component: Leaderboard })

function Leaderboard() {
  useAuthValidate()
  return (
    <main className="h-screen w-screen flex flex-col">
      <NavBar />
      <h1 className="text-6xl font-semibold pl-4 pt-2 tracking-widest uppercase">
        Leaderboard
      </h1>
      <div className="grid grid-rows-1 grid-cols-[1fr_3fr] min-h-0">
        <Sidebar />
        <MainLeaderboard />
      </div>
    </main>
  )
}
