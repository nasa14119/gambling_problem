import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameStore } from '#/stores/gameStore'
import { useEffect, useState } from 'react'

export const usePlayerData = (id: string) => {
  const { players } = useGameState()
  const data = useEventListener()
  const setState = useGameStore((s) => s.updateGameState)
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
      setIsActive(false)
    }
    if (eventId === 'user:turn') {
      setIsActive(false)
    }
    if (eventId === 'player:turn') {
      setIsActive(() => payload?.currentPlayer === id)
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
              chips: winners[0].chips,
              isFold: false,
              playerId: winners[0].playerId,
            },
          },
        }))
      }
    }
  }, [data])
  return { ...players[id], isActive }
}
