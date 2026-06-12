import { PlayerCard } from '#/components/PlayerCard'
import { Table } from '#/components/Table'
import { Exploit } from '#/components/Tutorial/Exploit'
import { ExploitCardTutorial } from '#/components/Tutorial/ExploitCardTutorial'
import { TooltipCustom } from '#/components/Tutorial/TultipCustom'
import { UserCards } from '#/components/Tutorial/UserCards'

export function Game({
  isActive,
  onClick,
}: {
  isActive: boolean
  onClick: () => void
}) {
  return (
    <div className="p-2 size-full relative bg-green-950 rounded-4xl">
      {/* Brief */}
      <div className="absolute top-5 left-5 w-[60ch] px-2 py-1 text-white text-xs bg-white/10 rounded-sm">
        <p>
          Gambling problem is base around poker. In poker you will need to make
          a good hand with the cards you got and the ones that will be reveal as
          the game progress. To continue in the game you need to match the
          current bet made by other players, and the winner get all the money
          pot in the table.
        </p>
      </div>
      {/* Table of cards */}
      <TooltipCustom text="This are the current cards involved in the round">
        <div className="absolute inset-x-0 flex justify-center top-0 pt-2 z-50">
          <Table
            table={
              isActive
                ? [null, null, null, null, null]
                : ['Kc', 'Kd', 'Kh', null, null]
            }
          />
        </div>
      </TooltipCustom>

      {/* Table money pot center in board */}
      <div className="absolute inset-0 flex justify-center items-center">
        <TooltipCustom text="Here you will see the pot that have build in turn ">
          <div className="h-[20vh] aspect-video bg-white/20 text-white flex flex-col items-center justify-center rounded-4xl">
            <span>Money</span>
            <span>Pot</span>
          </div>
        </TooltipCustom>
      </div>
      {/* Player cards */}
      <UserCards />
      {/* Oponent cards */}
      <TooltipCustom text="This are your oponents">
        <div className="absolute right-[5%] top-[30%]">
          <PlayerCard cards={null} />
        </div>
      </TooltipCustom>
      <TooltipCustom text="This is the current bet of player">
        {/* Money bet indicator */}
        <span className="bg-yellow-400 px-5 py-1 absolute top-[45%] right-[16%] rounded-4xl text-xs">
          50
        </span>
      </TooltipCustom>
      <TooltipCustom text="This are your oponents">
        <div className="absolute left-[5%] top-[30%]">
          <PlayerCard cards={null} />
        </div>
      </TooltipCustom>
      <TooltipCustom text="This are your oponents">
        <div className="absolute left-[15%] top-[60%]">
          <PlayerCard cards={null} />
        </div>
      </TooltipCustom>
      <TooltipCustom text="This are your oponents">
        <div className="absolute right-[15%] top-[60%]">
          <PlayerCard cards={null} />
        </div>
      </TooltipCustom>
      {/* This is the explioit example */}
      {isActive && <Exploit />}
      {!isActive && <ExploitCardTutorial onClick={onClick} />}
    </div>
  )
}
