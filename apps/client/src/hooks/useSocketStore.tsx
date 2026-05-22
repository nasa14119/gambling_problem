import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import type { EventPayload, EventSender, GameEventsClient } from '#/types'

const SOCKET_URL = 'ws://localhost:3000/api/game/connect'

type Data = EventPayload<GameEventsClient>

export const useSocketStore = (): [
  { data: Data | null; sendEvent: EventSender },
  boolean,
] => {
  // Making hook to the websocket client
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<
    Data | undefined
  >(`${SOCKET_URL}`, {
    shouldReconnect: () => true,
    queryParams: { playerId: 'player:admin' },
    onError: (e) => console.error(e),
  })
  const [data, setData] = useState<Data | null>(null)
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
export type useSocketValue = ReturnType<typeof useSocketStore>
