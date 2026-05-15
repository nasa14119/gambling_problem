import { useTableStore } from '#/store'
import { Fragment } from 'react'

export function Pot() {
  const moneyPot = useTableStore((s) => s.moneyPot)
  const isStarted = useTableStore((s) => s.start)
  const winnersPayload = useTableStore((s) => s.winners)
  if (!isStarted && !winnersPayload) return null
  return (
    <div className="fixed inset-0 -z-50 flex justify-center flex-col gap-y-3 items-center *:w-40 text-center *:rounded-4xl *:bg-gray-500/80">
      <span>money pot: ${moneyPot}</span>
      {winnersPayload && (
        <>
          <span>money win: ${winnersPayload.moneyWin}</span>
          {winnersPayload.winners.map((w) => (
            <Fragment key={w.playerId}>
              <span>{w.playerId}</span>
              <span>for: {w.for}</span>
              <span className="text-xs">
                new balance:
                <br /> ${w.money} chips: ${w.chips}
              </span>
            </Fragment>
          ))}
        </>
      )}
    </div>
  )
}
