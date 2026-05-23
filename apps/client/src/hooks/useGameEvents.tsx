import { useTablePot } from '#/hooks/useTablePot'
import { useTurnEvents } from '#/hooks/useTurnEvents'
import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameStore, useGameUpdate } from '#/stores/gameStore'
import { useEffect } from 'react'

export const useGameEvents = () => {
  const event = useEventListener()
  const { user } = useGameState()
  const setState = useGameUpdate()
  const setStateFunction = useGameStore((s) => s.updateGameState)
  useTurnEvents({ event })
  useTablePot()
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'round:end') {
      setState({ isStarted: false })
    }
    if (eventId === 'round:start') {
      setStateFunction((s) => ({
        ...s,
        user: { ...user, ...payload, currentBet: null },
        players: Object.fromEntries(
          Object.entries(s.players).map(([k, v]) => [
            k,
            { ...v, cards: null, isFold: false },
          ]),
        ),
      }))
    }
  }, [event])
  return
}
