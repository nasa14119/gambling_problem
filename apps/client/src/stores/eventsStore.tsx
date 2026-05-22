import { create } from 'zustand'
import { useSocketStore } from '#/hooks/useSocketStore'
import { useEffect, useMemo } from 'react'
import type {
  ClientEvents,
  EventData,
  EventPayload,
  EventSender,
  GameEventsClient,
} from '#/types'

type Store = {
  eventId?: GameEventsClient
  payload?: ClientEvents[GameEventsClient]
  sendEvent: null | EventSender
  setEvent: <T extends GameEventsClient>(event: EventPayload<T>) => void
  setStore: <T extends keyof Store>(param: Partial<Record<T, Store[T]>>) => void
}
export const useEventStore = create<Store>((set) => ({
  sendEvent: null,
  setEvent: ({ eventId, payload }) => set({ eventId, payload }),
  setStore: (param) => set({ ...param }),
}))

export const useEventSetter = () => useEventStore((s) => s.setEvent)
export const useEventSocket = () => {
  const setEvent = useEventStore((s) => s.setEvent)
  const setStore = useEventStore((s) => s.setStore)
  const [socketData, loading] = useSocketStore()
  useEffect(() => {
    setStore({ sendEvent: socketData.sendEvent })
  }, [socketData.sendEvent])
  useEffect(() => {
    // console.log(socketData.data)
    if (!socketData.data) return
    setEvent(socketData.data)
  }, [socketData.data])
  return loading
}
export const useEventListener = (): EventData | undefined => {
  const eventId = useEventStore((s) => s.eventId)
  const payload = useEventStore((s) => s.payload)
  const memo: EventData = useMemo(
    () => ({ eventId, payload }) as EventData,
    [eventId],
  )
  if (!eventId) return
  return memo
}
export const useEventSender = () => {
  const sendEvent = useEventStore((s) => s.sendEvent)
  return (param: EventPayload<GameEventsClient>) => {
    if (!sendEvent) {
      console.error('Event not send')
      return
    }
    sendEvent(param)
  }
}
