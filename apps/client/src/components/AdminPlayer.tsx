import { PlayerCardUI } from '#/components/PlayerCardUI'
import { usePlayerEvents } from '#/hooks/usePlayerEvents'
import { useSocket } from '#/hooks/useSocket'
import { useUpdatePlayer } from '#/plaingStore'
import { useTableStore } from '#/store'
import { useEffect } from 'react'

type Props = {
  playerId: string
}

export function AdminPlayer({ playerId }: Props) {
  const [{ data, sendEvent }, isConnected] = useSocket({ playerId })
  const playerInfo = usePlayerEvents({
    playerId,
    socket: [{ data, sendEvent }, isConnected],
  })
  const setEventSender = useTableStore((state) => state.setEventSender)
  const { setTurn } = useUpdatePlayer(playerId)
  const setStore = useTableStore((state) => state.setRound)
  useEffect(() => {
    if (!isConnected || !data) return
    const { eventId, payload } = data
    if (eventId === 'round:start') {
      sendEvent({ eventId: 'player:info', payload: undefined })
    }
    if (eventId === 'user:turn') {
      setTurn()
    }
    if (eventId === 'round:end') {
      setTurn(true)
    }
    setStore(eventId, payload)
  }, [data])
  useEffect(() => {
    setEventSender(sendEvent)
  }, [sendEvent])
  if (!isConnected) return null
  return <PlayerCardUI {...playerInfo} playerId={playerId} />
}
