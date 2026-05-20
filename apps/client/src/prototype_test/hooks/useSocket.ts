import { usePlaingStore } from '#/prototype_test/plaingStore'
import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

const SOCKET_URL = 'ws://localhost:3000/api/game/connect/prototype'

type Props = {
  playerId: string
}
type Data = { eventId: string; payload: any }
export type SendEvent = ({
  eventId,
  payload,
}: {
  eventId: string
  payload: any
}) => void
export const useSocket = ({
  playerId,
}: Props): [{ data: Data | null; sendEvent: SendEvent }, boolean] => {
  // Making hook to the websocket client
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<
    Data | undefined
  >(`${SOCKET_URL}`, {
    shouldReconnect: () => true,
    queryParams: { playerId },
  })
  const setPlayer = usePlaingStore((state) => state.setPlayers)
  const [data, setData] = useState<Data | null>(null)
  useEffect(() => {
    setPlayer(playerId, sendJsonMessage)
  }, [sendJsonMessage])
  useEffect(() => {
    if (!lastJsonMessage) return
    setData(() => lastJsonMessage)
  }, [lastJsonMessage])
  const isConnected = readyState === ReadyState.OPEN
  return [
    {
      data,
      sendEvent: sendJsonMessage,
    },
    isConnected,
  ]
}
export type useSocketValue = ReturnType<typeof useSocket>
