import { cn } from '#/lib/utils'
import { useEventSender } from '#/stores/eventsStore'

type Props = {
  rank: number | null
}
export function Rank({ rank }: Props) {
  const sendEvent = useEventSender()
  return (
    <main className="rounded-xl px-2 border-2 border-current border-dashed grid grid-cols-1 grid-rows-2 relative">
      <header className="flex justify-start items-center mt-5">
        <h3 className="text-3xl font-medium leading-3.75 ">Rank</h3>
      </header>
      <span className="flex justify-center items-center h-full">
        <span className="relative rounded-4xl border-2 border-white border-dashed w-full h-[3vh]">
          <span
            className={cn(
              'absolute top-0 left-0 h-full bg-blue-500/30 border-2 border-cyan-500  border-dashed rounded-4xl transition-all duration-125 ease overflow-hidden',
              rank === null && 'border-yellow-500 bg-yellow-500/30',
            )}
            style={{ width: `${rank ?? 100}%` }}
          ></span>
          {rank === null && (
            <span className="absolute inset-0 text-xl text-yellow-500 grid place-content-center">
              You have the maximum rank
            </span>
          )}
        </span>
      </span>
      {rank === null && (
        <button
          onClick={() => sendEvent({ eventId: 'end:game' })}
          className="rounded-sm border-2 border-dashed border-white capitalize absolute top-5 right-5 py-1 px-5"
        >
          Terminate Your Run
        </button>
      )}
    </main>
  )
}
