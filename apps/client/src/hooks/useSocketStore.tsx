import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import type { Options } from 'react-use-websocket'
import type { EventPayload, EventSender, GameEventsClient } from '#/types'
import { WS_PATH } from '#/env'

type Data = EventPayload<GameEventsClient>

export const useSocketStore = ({
  path = '',
  options = {},
}: {
  path: string
  options?: Options
}): [{ data: Data | null; sendEvent: EventSender }, boolean] => {
  // Making hook to the websocket client
  const URL = `${WS_PATH}${path}`
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<
    Data | undefined
  >(URL, {
    shouldReconnect: () => true,
    onError: (e) => console.error(e),
    ...options,
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
