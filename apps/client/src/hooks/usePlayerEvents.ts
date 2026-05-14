import { useSocket } from '#/hooks/useSocket'
import { useUpdatePlayer } from '#/plaingStore'
import type { PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'

export const usePlayerEvents = (playerId: string) => {
  const [{ data, sendEvent }, isConnected] = useSocket({ playerId })
  const { setTurn } = useUpdatePlayer(playerId, sendEvent)
  const [cards, setCard] = useState<PlayerHand>(null)
  const [isActive, setIsActive] = useState(false)
  const [placedBet, setPlacedBet] = useState(0)
  const [hasError, setHasError] = useState(false)
  useEffect(() => {
    if (!isConnected || !data) return
    const { eventId, payload } = data
    if (eventId === 'deck:cards_deal') {
      setCard(payload)
    }
    if (eventId === 'round:end') {
      setCard(null)
      setPlacedBet(0)
    }
    if (eventId === 'player:turn') {
      setIsActive(false)
    }
    if (eventId === 'user:turn') {
      setIsActive(true)
      setTurn()
    }
    if (
      (eventId === 'player:placedbet' && payload.player === playerId) ||
      (eventId === 'player:validbet' && payload.player === playerId)
    ) {
      setPlacedBet(payload.chips)
      setHasError(false)
    }
    if (
      'player:invalid_input' === eventId ||
      'player:insuficientfunds' === eventId
    ) {
      setHasError(true)
    }
  }, [data])
  return { isConnected, cards, isActive, placedBet, hasError }
}
