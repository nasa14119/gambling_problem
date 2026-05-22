import { Applications } from '#/components/Applications'
import { NavGame, NavGameItem } from '#/components/NavGame'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MainGame } from '#/components/MainGame'
import { BankUI } from '#/components/BankUI'
import { PockerFace, PockerTrigger } from '#/components/PockerFace'
import { useGameStore } from '#/stores/gameStore'
import { useEventSocket } from '#/stores/eventsStore'
import { useGameInit } from '#/hooks/useGameInit'

export const Route = createFileRoute('/game')({ component: CreateGame })

function CreateGame() {
  useGameInit()
  const isLoading = useGameStore((s) => s.isLoading)
  const error = useGameStore((s) => s.error)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return <SetUpGame />
}
function SetUpGame() {
  useEventSocket()
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
