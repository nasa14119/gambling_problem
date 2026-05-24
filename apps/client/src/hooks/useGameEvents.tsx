import { useTablePot } from '#/hooks/useTablePot'
import { useTurnEvents } from '#/hooks/useTurnEvents'
import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import { useEffect } from 'react'

export const useGameEvents = () => {
  const event = useEventListener()
  const { user, players } = useGameState()
  const setState = useGameUpdate()
  useTurnEvents({ event })
  useTablePot({ event })
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'round:end') {
      setState({ isStarted: false })
    }
    if (eventId === 'round:start') {
      const playerReset = Object.fromEntries(
        Object.entries(players).map(([k, v]) => [
          k,
          { chips: v.chips, playerId: v.playerId, isFold: false },
        ]),
      )
      setState({
        players: playerReset,
        user: { ...user, ...payload, currentBet: null },
      })
    }
  }, [event])
  return
}
