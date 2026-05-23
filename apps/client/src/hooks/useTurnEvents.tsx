import { useTablePot } from '#/hooks/useTablePot'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { EventData } from '#/types'
import { useEffect } from 'react'

type Props = {
  event?: EventData
}
export const useTurnEvents = ({ event }: Props) => {
  const { turn, user, players } = useGameState()
  useTablePot({ event })
  const setState = useGameUpdate()
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'player:turn') {
      // console.log({ eventId, payload })
      setState({
        turn: payload,
      })
      return
    }
    if (eventId === 'player:validbet') {
      setState({
        turn: turn
          ? { ...turn, minBet: Math.max(turn.minBet, payload.chips) }
          : null,
        players: {
          ...players,
          [payload.player.playerId]: {
            ...players[payload.player.playerId],
            isFold: payload.type === 'fold',
          },
        },
      })
      return
    }
    if (eventId === 'turn:end') {
      setState({
        user: { ...user, currentBet: null },
      })
      return
    }
  }, [event])
}
