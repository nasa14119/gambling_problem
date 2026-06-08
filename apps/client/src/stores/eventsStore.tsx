import { create } from 'zustand'
import { useSocketStore } from '#/hooks/useSocketStore'
import { useEffect, useMemo } from 'react'
import type {
  GameEventsClient,
  ClientEvents,
  EventSender,
  EventPayload,
  EventData,
} from '@repo/types/client'

type Store = {
  eventId?: GameEventsClient
  payload?: ClientEvents[GameEventsClient]
  isLoading: boolean
  sendEvent: null | EventSender
  setEvent: <T extends GameEventsClient>(event: EventPayload<T>) => void
  setStore: <T extends keyof Store>(param: Partial<Record<T, Store[T]>>) => void
  clear: () => void
}
export const useEventStore = create<Store>((set) => ({
  isLoading: false,
  sendEvent: null,
  setEvent: ({ eventId, payload }) => set({ eventId, payload }),
  setStore: (param) => set({ ...param }),
  clear: () => set({ eventId: undefined, payload: undefined }),
}))

export const useEventClear = () => useEventStore((s) => s.clear)
export const useEventSetter = () => useEventStore((s) => s.setEvent)
export const useEventSocket = () => {
  const setEvent = useEventStore((s) => s.setEvent)
  const setStore = useEventStore((s) => s.setStore)
  const [socketData, isConnected] = useSocketStore<EventData>({
    path: '/api/game/connect',
    options: {
      queryParams: { playerId: 'player:admin' },
    },
  })
  useEffect(() => {
    setStore({ isLoading: !isConnected })
  }, [isConnected])
  useEffect(() => {
    setStore({ sendEvent: socketData.sendEvent as EventSender })
  }, [socketData.sendEvent])
  useEffect(() => {
    if (!socketData.data) return
    setEvent(socketData.data)
  }, [socketData.data])
  return
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

export const useRoundStart = ():
  | { isLoading: true; sendEvent: null }
  | { isLoading: false; sendEvent: () => void } => {
  const sendEvent = useEventStore((s) => s.sendEvent)
  const isLoading = useEventStore((s) => s.isLoading)
  if (isLoading) return { isLoading: true, sendEvent: null }
  return {
    isLoading: false,
    sendEvent: () => sendEvent!({ eventId: 'round:start', payload: undefined }),
  }
}
