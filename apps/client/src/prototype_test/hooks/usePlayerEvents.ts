import type { useSocketValue } from '#/prototype_test/hooks/useSocket'
import { useUpdatePlayer } from '#/prototype_test/plaingStore'
import type { PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'

type Props = {
  playerId: string
  socket: useSocketValue
}
export const usePlayerEvents = ({ playerId, socket }: Props) => {
  const [{ data, sendEvent }, isConnected] = socket
  const { setTurn } = useUpdatePlayer(playerId)
  const [cards, setCard] = useState<PlayerHand>(null)
  const [isActive, setIsActive] = useState(false)
  const [placedBet, setPlacedBet] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [playerMoney, setPlayerMoney] = useState({ chips: 0, money: 0 })
  useEffect(() => {
    if (!isConnected || !data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
      setCard(null)
      sendEvent({ eventId: 'player:info', payload: undefined })
    }
    if (eventId === 'player:info_data') {
      setPlayerMoney({ chips: payload.chips, money: payload.money })
      setCard(payload.cards)
    }
    if (eventId === 'turn:start') {
      setPlacedBet(0)
    }
    if (eventId === 'deck:cards_deal') {
      setCard(payload)
    }
    if (eventId === 'round:end') {
      setPlacedBet(0)
      setIsActive(false)
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
      setPlacedBet((prev) => prev + payload.chips)
      setPlayerMoney(({ chips, money }) => ({
        money,
        chips: chips - payload.chips,
      }))
      setHasError(false)
    }
    if (
      'player:invalid_input' === eventId ||
      'player:insuficientfunds' === eventId
    ) {
      setHasError(true)
      console.error(data)
    }
    if (eventId === 'round:winners') {
      const { winners } = payload as {
        winners: { playerId: string; chips: number }[]
      }
      const isWinner = winners.filter((w) => w.playerId === playerId)
      if (isWinner.length > 0) {
        setPlayerMoney((prev) => ({
          ...prev,
          chips: isWinner[0].chips,
        }))
      }
    }
  }, [data])
  return { isConnected, cards, isActive, placedBet, hasError, playerMoney }
}
