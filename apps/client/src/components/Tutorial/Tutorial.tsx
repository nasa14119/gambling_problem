import { Application, Applications } from '#/components/Applications'
import { NavGame, NavGameItem } from '#/components/NavGame'
import { Table } from '#/components/Table'
import type { Tabs } from '#/routes/game'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { SquareTerminal } from 'lucide-react'
import { useState } from 'react'
import { PockerFaceTutorial } from './PockerFaceTutorial'
import type { TriggerPockerFace } from './PockerFaceTutorial'
import type { PockerFaceState } from '@repo/types/client'

export function Tutorial() {
  const [current, setCurrent] = useState<Tabs>('casino')
  const [pockerFace, setPoker] = useState<PockerFaceState>('idle')
  const trigger: TriggerPockerFace = (state) => setPoker(state)
  return (
    <div className="p-5">
      <main className="size-full grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-neutral-300 rounded-4xl overflow-hidden">
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
          <div className="p-2 size-full relative bg-green-950 rounded-4xl">
            <Tooltip>
              <TooltipTrigger className="absolute inset-x-0 flex justify-center top-0 pt-2">
                <Table table={['Kc', 'Kd', 'Kh', null, null]} />
              </TooltipTrigger>
              <TooltipContent className="text-slate-950 ">
                <span className="text-white">
                  This are the current cards involved in the round
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Applications>
          <Application
            Icon={SquareTerminal}
            tooltip="PockerFace"
            onClick={() => trigger('open')}
          />
        </Applications>
        <PockerFaceTutorial state={pockerFace} trigger={trigger} />
      </main>
    </div>
  )
}
