import { PlayerCardUI } from '#/components/PlayerCardUI'
import { useSocket } from '#/hooks/useSocket'
import { useUpdatePlayer } from '#/plaingStore'
import { useTableStore } from '#/store'
import type { PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'

type Props = {
  playerId: string
}

export function AdminPlayer({ playerId }: Props) {
  const [{ data, sendEvent }, isConnected] = useSocket({ playerId })
  const setEventSender = useTableStore((state) => state.setEventSender)
  const { setTurn } = useUpdatePlayer(playerId, sendEvent)
  const setStore = useTableStore((state) => state.setRound)
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
    }
    if (eventId === 'user:turn') {
      setTurn()
    }
    setStore(eventId, payload)
    if (eventId === 'player:turn') {
      setIsActive(false)
    }
    if (eventId === 'user:turn') {
      setIsActive(true)
    }
    if (eventId === 'player:placedbet') {
      setPlacedBet(payload.chips)
      setHasError(false)
    }
    if (
      'player:invalid_input' === eventId ||
      'player:insuficientfunds' === eventId
    ) {
      setHasError(true)
      console.error(payload.error)
    }
  }, [data])
  useEffect(() => {
    setEventSender(sendEvent)
  }, [sendEvent])
  if (!isConnected) return null
  return (
    <PlayerCardUI
      cards={cards}
      isConnected={isConnected}
      hasError={hasError}
      isActive={isActive}
      placedBet={placedBet}
    />
  )
}
