import { useEventListener } from '../stores/eventsStore.tsx'
import { useEffect } from 'react'
import { useGameState, useGameUpdate } from '#/stores/gameStore.ts'

type Props = {
  playerId: string
}
export const useUserEvents = ({ playerId }: Props) => {
  const data = useEventListener()
  const { user, players } = useGameState()
  const setState = useGameUpdate()
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'deck:cards_deal') {
      setState({ user: { ...user, cards: payload } })
    }
    if (eventId === 'player:validbet') {
      if (payload.player.playerId !== playerId) return
      setState({
        user: {
          ...user,
          chips: payload.player.chips,
          isFold: payload.type === 'fold',
          currentBet: (user.currentBet ?? 0) + payload.chips,
        },
      })
    }
    if (eventId === 'round:winners') {
      const winners = payload.winners.filter((w) => w.playerId === playerId)
      if (winners[0]) {
        setState({
          user: { ...user, currentBet: null, chips: winners[0].chips },
        })
      }
    }
    if (eventId === 'round:start') {
      setState({
        user: { ...user, isFold: false },
      })
    }
    if (eventId === 'bot:reset') {
      const { newPlayer, prevPlayer } = payload
      const { [prevPlayer.playerId]: _, ...rest } = players
      setTimeout(() => {
        setState({ players: { ...players, [prevPlayer.playerId]: null } })
      }, 2_000)
      setTimeout(() => {
        setState({ players: { ...rest, [newPlayer.playerId]: newPlayer } })
      }, 3_000)
    }
  }, [data])
}
