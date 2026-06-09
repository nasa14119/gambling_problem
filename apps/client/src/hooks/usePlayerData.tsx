import { useCardValue } from '#/components/PlayersCardsStore'
import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { GameState, PlayerHand } from '@repo/types'
import { useEffect, useState } from 'react'

export type PlayerUseData =
  | null
  | (NonNullable<GameState['players'][string]> & {
      isActive: boolean
      cards: PlayerHand
    })
export const usePlayerData = (id: string): PlayerUseData => {
  const { players } = useGameState()
  const data = useEventListener()
  const setState = useGameUpdate()
  const [isActive, setIsActive] = useState(false)
  const [cards, setCards] = useCardValue(id)
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
  const player = players[id]
  if (player === null) {
    return null
  }
  return { ...player, isActive, cards }
}
