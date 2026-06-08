import { useTablePot } from '#/hooks/useTablePot'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { EventData } from '@repo/types/client'
import { useEffect } from 'react'

type Props = {
  event?: EventData
}
export const useTurnEvents = ({ event }: Props) => {
  const { turn, user } = useGameState()
  useTablePot({ event })
  const setState = useGameUpdate()
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'player:turn') {
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
