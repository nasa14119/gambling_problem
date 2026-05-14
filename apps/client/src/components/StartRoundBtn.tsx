import { useEventSender, useTableStore } from '#/store'

export function StartRoundBtn() {
  const isStart = useTableStore((state) => state.start)
  const eventSender = useEventSender()
  if (isStart) return null
  return (
    <button
      className="fixed bottom-5 right-5 bg-green-400 text-white px-5 py-2 rounded-4xl"
      onClick={() => eventSender('round:start', {})}
    >
      Start Round
    </button>
  )
}
