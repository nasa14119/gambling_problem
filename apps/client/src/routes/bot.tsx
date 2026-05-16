import { AdminPlayer } from '#/components/AdminPlayer'
import { InputPlayer } from '#/components/InputPlayer'
import { PlayerManager } from '#/components/PlayerManager'
import { Pot } from '#/components/Pot'
import { StartRoundBtn } from '#/components/StartRoundBtn'
import { Table } from '#/components/Table'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/bot')({ component: CreateGame })

function CreateGame() {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    fetch('http://localhost:3000/api/game/new/botlobbie', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error creating game')
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])
  if (isLoading) return <div>Loading...</div>
  return <Game />
}
function Game() {
  return (
    <main className="size-full  h-screen relative flex justify-center items-center flex-col gap-y-5">
      <header>
        <Table />
      </header>
      <div className="flex justify-between w-full px-[10%]">
        <PlayerManager playerId="bot:1" />
        <PlayerManager playerId="bot:2" />
      </div>
      <div className="flex justify-between w-full px-[10%]">
        <PlayerManager playerId="bot:3" />
        <PlayerManager playerId="bot:4" />
      </div>
      <div>
        <AdminPlayer playerId="player:admin" />
      </div>
      <StartRoundBtn />
      <InputPlayer />
      <Pot />
    </main>
  )
}
