import { Applications } from '#/components/Applications'
import { NavGame, NavGameItem } from '#/components/NavGame'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MainGame } from '#/components/MainGame'
import { BankUI } from '#/components/BankUI'
import { PockerFace, PockerTrigger } from '#/components/PockerFace'

export const Route = createFileRoute('/game')({ component: CreateGame })

function CreateGame() {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    fetch('http://localhost:3000/api/game/new/singlePlayer', {
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
function Game() {
  const [current, setCurrent] = useState<'casino' | 'bank'>('casino')
  return (
    <>
      <PockerFace />
      <main className="size-full  h-screen grid grid-cols-1 grid-rows-[auto_1fr_auto]">
        <NavGame current={current}>
          <NavGameItem
            text="Casino"
            isActive={current === 'casino'}
            onClick={() => setCurrent('casino')}
          />
          <NavGameItem
            text="Central Bank"
            isActive={current === 'bank'}
            onClick={() => setCurrent('bank')}
          />
        </NavGame>
        <div className="p-2 size-full">
          {current === 'casino' && <MainGame />}
          {current === 'bank' && <BankUI />}
        </div>
        <Applications>
          <PockerTrigger />
        </Applications>
      </main>
    </>
  )
}
