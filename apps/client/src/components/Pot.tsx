import { PlayerCard } from '#/components/PlayerCard'
import { Table } from '#/components/Table'
import { useWinnersData } from '#/hooks/useWinnersData'
import { useGameState } from '#/stores/gameStore'
import type { WinnersPayload } from '@repo/types'

export function Pot() {
  const { pot } = useGameState()
  const winners = useWinnersData()
  return (
    <>
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 flex flex-col justify-center items-center text-center bg-neutral-400/50 min-w-[20vw] aspect-video rounded-4xl py-2 px-5">
        {winners ? (
          <Winners winners={winners} />
        ) : (
          <>
            <div>Money Pot</div>
            <div>{pot ?? 0}</div>
          </>
        )}
      </div>
    </>
  )
}

function Winners({ winners }: { winners: NonNullable<WinnersPayload> }) {
  if (winners.winners.length > 1)
    return (
      <>
        <div>Draw {winners.winners[0].for}</div>
        {winners.winners.map((w, i) => (
          <div key={i}>
            <div>
              <PlayerCard cards={w.cards} scale={0.5} />
            </div>
            <span>{w.playerId}</span>
          </div>
        ))}
        <div>Winning {winners.moneyWin} chips</div>
      </>
    )
  const winner = winners.winners[0]
  return (
    <>
      <div className="font-semibold leading-5">
        Winner <span className="text-emerald-100">{winner.playerId}</span> for{' '}
        <span className="italic lowercase">{winner.for}</span>
      </div>
      <div className="font-medium text-sm py-2">
        Winning{' '}
        <span className="text-green-300 font-medium text-base">
          {winners.moneyWin}
        </span>{' '}
        chips
      </div>
      <Table
        table={winners.gameState}
        scale={0.5}
        next={false}
        className="*:rounded-sm"
      />
      <div>
        <PlayerCard cards={winner.cards} scale={0.5} className="rounded-sm" />
      </div>
    </>
  )
}
