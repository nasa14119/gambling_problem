import { useEventSender } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'

export function StartGameBtn() {
  const eventSender = useEventSender()
  const { isStarted } = useGameState()
  const setState = useGameUpdate()
  const handleClick = () => {
    eventSender({ eventId: 'round:start' })
    setState({ isStarted: true })
  }
  if (isStarted) return null
  return (
    <button
      className="px-4 py-2 rounded-full bg-gray-400/20 text-white"
      onClick={handleClick}
    >
      StartGameBtn
    </button>
  )
}
