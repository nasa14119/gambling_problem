import { useCallback, useEffect, useState } from 'react'
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
}: Props):
  | [{ data: Data; sendEvent: SendEvent }, true]
  | [{ data: null; sendEvent: SendEvent }, false] => {
  // Making hook to the websocket client
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<
    Data | undefined
  >(`${SOCKET_URL}`, {
    shouldReconnect: () => true,
    queryParams: { playerId },
  })
  const sendEvent: SendEvent = useCallback(
    (param) => {
      sendJsonMessage(param)
    },
    [sendJsonMessage],
  )
  const [data, setData] = useState<Data | null>(null)
  useEffect(() => {
    if (!lastJsonMessage) return
    setData(() => lastJsonMessage)
  }, [lastJsonMessage])
  const isConnected = readyState === ReadyState.OPEN && data !== null
  return isConnected
    ? [
        {
          data,
          sendEvent,
        },
        true,
      ]
    : [{ data: null, sendEvent }, false]
}
