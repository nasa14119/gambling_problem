import { Applications } from '#/components/Applications'
import { NavGame, NavGameItem } from '#/components/NavGame'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MainGame } from '#/components/MainGame'
import { Bank } from '#/components/Bank/BankUI'
import { PockerFace, PockerTrigger } from '#/components/PockerFace'
import { useGameStore } from '#/stores/gameStore'
import { useEventListener, useEventSocket } from '#/stores/eventsStore'
import { useGameInit } from '#/hooks/useGameInit'
import { usePockerFace } from '#/components/PockerFace/store'
import { ErrorPage } from '#/components/ErrorPage'

export const Route = createFileRoute('/game')({ component: CreateGame })

function CreateGame() {
  useGameInit()
  const router = useRouter()
  const isLoading = useGameStore((s) => s.isLoading)
  const data = useEventListener()
  useEffect(() => {
    if (!data) return
    if (data.eventId === 'reset:hard') router.navigate({ to: '/summary' })
  }, [data])
  const error = useGameStore((s) => s.error)
  if (isLoading) return <div>Loading...</div>
  if (error) return <ErrorPage error={error} />
  return <SetUpGame />
}
function SetUpGame() {
  useEventSocket()
  return <Game />
}
export type Tabs = 'casino' | 'bank'
function Game() {
  const setPockerFace = usePockerFace((s) => s.setState)
  const [current, setCurrent] = useState<Tabs>('casino')
  const handleClick = (path: Tabs) => {
    setPockerFace('idle')
    setCurrent(path)
  }
  return (
    <>
      <PockerFace />
      <main className="size-full  h-screen grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-neutral-300">
        <NavGame current={current}>
          <NavGameItem
            text="Casino"
            isActive={current === 'casino'}
            onClick={() => handleClick('casino')}
          />
          <NavGameItem
            text="Loan Manager"
            isActive={current === 'bank'}
            onClick={() => handleClick('bank')}
          />
        </NavGame>
        <div className="p-2 size-full relative">
          {current === 'casino' && <MainGame />}
          {current === 'bank' && <Bank />}
        </div>
        <Applications>
          <PockerTrigger />
        </Applications>
      </main>
    </>
  )
}
