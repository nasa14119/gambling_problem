import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import { useEffect } from 'react'

export const useTablePot = () => {
  const setState = useGameUpdate()
  const { turn } = useGameState()
  const events = useEventListener()
  useEffect(() => {
    if (!events) return
    const { eventId, payload } = events
    if (eventId === 'player:validbet') {
      setState({
        turn: turn
          ? {
              ...turn,
              playersPots: {
                ...turn.playersPots,
                [payload.player.playerId]:
                  (turn.playersPots[payload.player.playerId] ?? 0) +
                  payload.chips,
              },
            }
          : null,
      })
    }
    if (eventId === 'turn:end') {
      setState({ turn: null, pot: payload.moneyPot })
    }
    if (eventId === 'round:start') {
      setState({ pot: null, turn: null })
    }
  }, [events])
  return
}
