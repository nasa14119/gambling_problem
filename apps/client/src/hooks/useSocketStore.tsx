import useWebSocket, { ReadyState } from 'react-use-websocket'
import type { Options } from 'react-use-websocket'
import { WS_PATH } from '#/env'

type EventSender<T> = (param: T) => void
export const useSocketStore = <T extends any>({
  path = '',
  options = {},
}: {
  path: string
  options?: Options
}): [{ data: T | null; sendEvent: EventSender<T> | null }, boolean] => {
  // Making hook to the websocket client
  const URL = `${WS_PATH}${path}`
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<
    T | undefined
  >(URL, {
    shouldReconnect: () => true,
    onError: (e) => console.error(e),
    ...options,
  })
  const isConnected = readyState === ReadyState.OPEN
  return [
    {
      data: lastJsonMessage ?? null,
      sendEvent: sendJsonMessage,
    },
    isConnected,
  ]
}
export type useSocketValue<T> = ReturnType<typeof useSocketStore<T>>
