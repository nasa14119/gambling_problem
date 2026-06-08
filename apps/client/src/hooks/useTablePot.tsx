import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { EventData } from '@repo/types/client'
import { useEffect } from 'react'

export const useTablePot = ({ event }: { event?: EventData }) => {
  const setState = useGameUpdate()
  const { user, pot } = useGameState()
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'turn:end') {
      setState({
        turn: null,
        pot: (pot ?? 0) + payload.moneyPot,
        user: { ...user, currentBet: null },
      })
    }
    if (eventId === 'round:start') {
      setState({ pot: null, turn: null })
    }
  }, [event])
  return
}
