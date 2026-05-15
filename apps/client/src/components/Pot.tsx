import { useTableStore } from '#/store'

export function Pot() {
  const moneyPot = useTableStore((state) => state.moneyPot)
  const winnersPayload = useTableStore((s) => s.winners)
  return (
    <div className="fixed inset-0 -z-50 flex justify-center flex-col gap-y-3 items-center *:w-40 text-center *:rounded-4xl *:bg-gray-500/80">
      <span>money pot: ${moneyPot}</span>
      {winnersPayload && (
        <>
          <span>money win: ${winnersPayload.moneyWin}</span>
          {winnersPayload.winners.map((w) => (
            <>
              <span>{w.playerId}</span>
              <span>for: {w.for}</span>
              <span className="text-xs">
                new balance:
                <br /> ${w.money} chips: ${w.chips}
              </span>
            </>
          ))}
        </>
      )}
    </div>
  )
}
