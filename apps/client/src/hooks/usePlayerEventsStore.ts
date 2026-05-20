import { useEventListener } from '../eventsStore.tsx'
import { useUpdatePlayer } from '#/prototype_test/plaingStore.ts'
import type { PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'
import type { ClientEvents } from '#/types.ts'

type Props = {
  playerId: string
}
export const usePlayerEventsStore = ({ playerId }: Props) => {
  const data = useEventListener()
  const { setTurn } = useUpdatePlayer(playerId)
  const [cards, setCard] = useState<PlayerHand>(null)
  const [isActive, setIsActive] = useState(false)
  const [placedBet, setPlacedBet] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [playerMoney, setPlayerMoney] = useState({ chips: 0, money: 0 })
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
      setCard(null)
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
    if (eventId === 'player:placedbet' || eventId === 'player:validbet') {
      const { chips, player } = payload as ClientEvents['player:placedbet']
      if (player !== playerId) return
      setPlacedBet((prev) => prev + chips)
      setPlayerMoney(({ chips: prevChips, money }) => ({
        money,
        chips: prevChips - chips,
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
      const { winners } = payload
      const isWinner = winners.filter((w) => w.playerId === playerId)
      if (isWinner.length > 0) {
        setPlayerMoney((prev) => ({
          ...prev,
          chips: isWinner[0].chips,
        }))
      }
    }
  }, [data])
  return { cards, isActive, placedBet, hasError, playerMoney }
}
