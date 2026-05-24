import { AdminPlayer } from '#/prototype_test/components/AdminPlayer'
import { InputPlayer } from '#/prototype_test/components/InputPlayer'
import { PlayerManager } from '#/prototype_test/components/PlayerManager'
import { Pot } from '#/prototype_test/components/Pot'
import { StartRoundBtn } from '#/prototype_test/components/StartRoundBtn'
import { Table as TableUI } from '#/components/Table'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTableStore } from '#/prototype_test/store'
import { SERVER_PATH } from '#/env'

export const Route = createFileRoute('/test')({ component: CreateGame })

function CreateGame() {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${SERVER_PATH}/api/game/new/prototype`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        players: ['player:1', 'player:2', 'player:3', 'player:4', 'player:5'],
      }),
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
function Table() {
  const table = useTableStore((s) => s.table)
  return <TableUI table={table} />
}
function Game() {
  return (
    <main className="size-full  h-screen relative flex justify-center items-center flex-col gap-y-5">
      <header>
        <Table />
      </header>
      <div className="flex justify-between w-full px-[10%]">
        <PlayerManager playerId="player:1" />
        <PlayerManager playerId="player:2" />
      </div>
      <div className="flex justify-between w-full px-[10%]">
        <PlayerManager playerId="player:3" />
        <PlayerManager playerId="player:4" />
      </div>
      <div>
        <AdminPlayer playerId="player:5" />
      </div>
      <StartRoundBtn />
      <InputPlayer />
      <Pot />
    </main>
  )
}
