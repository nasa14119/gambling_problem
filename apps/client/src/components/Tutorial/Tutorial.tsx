import { Application, Applications } from '#/components/Applications'
import { NavGame, NavGameItem } from '#/components/NavGame'
import type { Tabs } from '#/routes/game'
import { SquareTerminal } from 'lucide-react'
import { useState } from 'react'
import { PockerFaceTutorial } from './PockerFaceTutorial'
import type { TriggerPockerFace } from './PockerFaceTutorial'
import type { PockerFaceState } from '@repo/types/client'
import { Game } from '#/components/Tutorial/Game'
import { Bank } from '#/components/Tutorial/Bank'
import { RankingTrigger } from '#/components/RankingCards/RankingTrigger'
import { RankingCards } from '#/components/RankingCards/RankingCards'
import { RankingCardsContainer } from '#/components/RankingCards/RankingCardsContainer'
import { RankingCardsContent } from '#/components/RankingCards/RankingCardsContent'

export function Tutorial() {
  const [current, setCurrent] = useState<Tabs>('casino')
  const [pockerFace, setPoker] = useState<PockerFaceState>('idle')
  const [isActive, setState] = useState<boolean>(false)
  const trigger: TriggerPockerFace = (state) => setPoker(state)
  return (
    <div className="p-5">
      <main className="size-full grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-neutral-300 rounded-4xl overflow-hidden relative">
        <NavGame current={current}>
          <NavGameItem
            text="Casino"
            isActive={current === 'casino'}
            onClick={() => setCurrent('casino')}
          />
          <NavGameItem
            text="Loan Manager"
            isActive={current === 'bank'}
            onClick={() => setCurrent('bank')}
          />
        </NavGame>
        <div className="p-2">
          {current === 'casino' && (
            <Game isActive={isActive} onClick={() => setState(true)} />
          )}
          {current === 'bank' && <Bank />}
        </div>
        <Applications>
          <Application
            Icon={SquareTerminal}
            tooltip="PockerFace"
            onClick={() => trigger('open')}
          />
          <RankingTrigger />
        </Applications>
        <PockerFaceTutorial
          state={pockerFace}
          trigger={trigger}
          isActive={isActive}
          onClick={() => {
            setState(false)
          }}
        />
        <RankingCards>
          <RankingCardsContainer className="translate-0 left-auto top-auto right-2 bottom-5 w-fit">
            <RankingCardsContent className="flex flex-col" />
          </RankingCardsContainer>
        </RankingCards>
      </main>
    </div>
  )
}
