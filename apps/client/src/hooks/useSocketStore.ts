import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import type { GameEvents } from '@repo/types/server'
import type { EventPayload, EventSender } from '#/types'
import { usePlaingStore } from '#/plaingStore'

const SOCKET_URL = 'ws://localhost:3000/api/game/connect'

type Data = EventPayload<GameEvents>

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
  })
  const setPlayer = usePlaingStore((state) => state.setPlayers)
  const [data, setData] = useState<Data | null>(null)
  useEffect(() => {
    if (!lastJsonMessage) return
    setData(() => lastJsonMessage)
  }, [lastJsonMessage])
  useEffect(() => {
    setPlayer('player:admin', sendJsonMessage)
  }, [sendJsonMessage])
  const isConnected = readyState === ReadyState.OPEN && data !== null
  return [
    {
      data,
      sendEvent: sendJsonMessage,
    },
    isConnected,
  ]
}
export type useSocketValue = ReturnType<typeof useSocketStore>
