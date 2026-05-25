import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'

export const usePlayerData = (id: string) => {
  const { players } = useGameState()
  const data = useEventListener()
  const setState = useGameUpdate()
  const [isActive, setIsActive] = useState(false)
  const [cards, setCards] = useState<PlayerHand>(null)
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
      setIsActive(false)
      setCards(null)
    }
    if (eventId === 'user:turn' || eventId === 'round:end') {
      setIsActive(false)
    }
    if (eventId === 'player:turn') {
      setIsActive(() => payload?.currentPlayer === id)
    }
    if (eventId === 'player:validbet') {
      if (payload.player.playerId !== id) return
      setState({
        players: {
          ...players,
          [id]: { ...payload.player, isFold: payload.type === 'fold' },
        },
      })
      return
    }
    if (eventId === 'round:winners') {
      const winners = payload.winners.filter((w) => w.playerId === id)
      if (winners[0]) {
        setCards(winners[0].cards)
        setState({
          players: {
            ...players,
            [id]: {
              chips: winners[0].chips,
              isFold: false,
              playerId: winners[0].playerId,
            },
          },
        })
      }
    }
  }, [data])
  return { ...players[id], isActive, cards }
}
