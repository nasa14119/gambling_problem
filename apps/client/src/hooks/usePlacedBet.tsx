import { useEventListener } from '#/stores/eventsStore'
import { useGameState } from '#/stores/gameStore'
import { useEffect, useState } from 'react'

export const usePlacedBet = () => {
  const data = useEventListener()
  const {
    user: { playerId },
  } = useGameState()
  const [placedBet, setBet] = useState(0)
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'player:validbet' && payload.player.playerId === playerId) {
      setBet((p) => p + payload.chips)
    }
    if (eventId === 'round:start') {
      setBet(0)
    }
  }, [data])
  return placedBet
}
