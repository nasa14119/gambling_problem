import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameStore } from '#/stores/gameStore'
import { useEffect } from 'react'

export const usePlayerData = (id: string) => {
  const { players } = useGameState()
  const data = useEventListener()
  const setState = useGameStore((s) => s.updateGameState)
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
    }
    if (eventId === 'player:validbet') {
      if (payload.player.playerId !== id) return
      setState((prev) => ({
        ...prev,
        players: {
          ...prev.players,
          [id]: { ...payload.player, isFold: payload.type === 'fold' },
        },
      }))
      return
    }
    if (eventId === 'round:winners') {
      const winners = payload.winners.filter((w) => w.playerId === id)
      if (winners[0]) {
        setState((state) => ({
          ...state,
          players: {
            ...state.players,
            [id]: {
              cards: winners[0].cards,
              chips: winners[0].chips,
              isFold: false,
            },
          },
        }))
      }
    }
  }, [data])
  return players[id]
}
