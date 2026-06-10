import { PlayerCard } from '#/components/PlayerCard'
import { Table } from '#/components/Table'
import { Exploit } from '#/components/Tutorial/Exploit'
import { ExploitCardTutorial } from '#/components/Tutorial/ExploitCardTutorial'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import type { ComponentProps, PropsWithChildren } from 'react'

export function Game({
  isActive,
  onClick,
}: {
  isActive: boolean
  onClick: () => void
}) {
  return (
    <div className="p-2 size-full relative bg-green-950 rounded-4xl">
      <TooltipCustom text="This are the current cards involved in the round">
        <div className="absolute inset-x-0 flex justify-center top-0 pt-2">
          <Table
            table={
              isActive
                ? [null, null, null, null, null]
                : ['Kc', 'Kd', 'Kh', null, null]
            }
          />
        </div>
      </TooltipCustom>

      <div className="absolute flex bottom-1 justify-center inset-x-0">
        <TooltipCustom text="This are your cards">
          <PlayerCard cards={['Ks', 'As']} />
        </TooltipCustom>
      </div>

      {isActive && <Exploit />}
      {!isActive && <ExploitCardTutorial onClick={onClick} />}
    </div>
  )
}
function TooltipCustom({
  text,
  children,
  side = 'top',
  ...rest
}: {
  text: string
  side?: 'right' | 'left' | 'bottom' | 'top'
} & PropsWithChildren &
  Omit<ComponentProps<typeof TooltipTrigger>, 'asChild'>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild {...rest}>
        {children}
      </TooltipTrigger>
      <TooltipContent className="text-slate-950 " side={side}>
        <span className="text-white">{text}</span>
      </TooltipContent>
    </Tooltip>
  )
}
