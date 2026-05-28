import { useEventListener } from '../stores/eventsStore.tsx'
import { useEffect } from 'react'
import { useGameState, useGameUpdate } from '#/stores/gameStore.ts'

type Props = {
  playerId: string
}
export const useUserEvents = ({ playerId }: Props) => {
  const data = useEventListener()
  const { user } = useGameState()
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
  }, [data])
}
