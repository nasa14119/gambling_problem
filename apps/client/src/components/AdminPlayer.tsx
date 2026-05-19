import { PlayerCardUI } from '#/components/PlayerCardUI'
import { useEventListener, useEventSocket } from '#/eventsStore'
import { usePlayerEventsStore } from '#/hooks/usePlayerEventsStore'
import { useUpdatePlayer } from '#/plaingStore'
import { useTableStore } from '#/store'
import { useEffect } from 'react'

type Props = {
  playerId: string
}

export function AdminPlayer({ playerId }: Props) {
  useEventSocket()
  const data = useEventListener()
  const playerInfo = usePlayerEventsStore({
    playerId,
  })
  const { setTurn } = useUpdatePlayer(playerId)
  const setStore = useTableStore((state) => state.setRound)
  useEffect(() => {
    if (!data) return
    const { eventId, payload } = data
    if (eventId === 'user:turn') {
      setTurn()
    }
    if (eventId === 'round:end') {
      setTurn(true)
    }
    setStore(eventId, payload)
  }, [data])
  return <PlayerCardUI {...playerInfo} playerId={playerId} />
}
