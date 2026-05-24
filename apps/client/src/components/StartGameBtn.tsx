import { cn } from '#/lib/utils'
import { useRoundStart } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'

export function StartGameBtn() {
  const { isLoading, sendEvent: startRound } = useRoundStart()
  const { isStarted } = useGameState()
  const setState = useGameUpdate()
  const handleClick = () => {
    if (isLoading) return
    startRound()
    setState({ isStarted: true })
  }

  if (isStarted) return null
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-full bg-gray-400/20 text-white z-50 relative',
        isLoading && 'opacity-50',
      )}
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? 'Loading...' : 'Start Round'}
    </button>
  )
}
