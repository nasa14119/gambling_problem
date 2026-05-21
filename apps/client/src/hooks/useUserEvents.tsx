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
        },
      })
    }
  }, [data])
}
