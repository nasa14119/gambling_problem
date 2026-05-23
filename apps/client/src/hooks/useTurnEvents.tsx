import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { EventData } from '#/types'
import { useEffect } from 'react'

type Props = {
  event?: EventData
}
export const useTurnEvents = ({ event }: Props) => {
  const { turn, user } = useGameState()
  const setState = useGameUpdate()
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'player:turn') {
      setState({
        turn: payload,
      })
    }
    if (eventId === 'player:validbet') {
      setState({
        turn: turn
          ? { ...turn, minBet: Math.max(turn.minBet, payload.chips) }
          : null,
      })
    }
    if (eventId === 'user:turn') {
      setState({
        turn: turn
          ? { ...turn, currentPlayer: user.playerId }
          : { currentPlayer: user.playerId, minBet: 0, playersPots: {} },
      })
    }
  }, [event])
}
