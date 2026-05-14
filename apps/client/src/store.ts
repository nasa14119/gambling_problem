import type { Card } from '@repo/types'
import { create } from 'zustand'

type TableStore = {
  table: Card[] | null
  start: boolean
  eventSender: ((payload: any) => void) | null
  setTable: (table: Card[]) => void
  setRound: (eventId: string, payload: any) => void
  setEventSender: (eventSender: (payload: any) => void) => void
}
export const useTableStore = create<TableStore>((set) => ({
  table: null,
  start: false,
  setTable: (table) => set({ table }),
  setRound: (eventId, payload) => {
    if (eventId === 'round:start') set({ start: true })
    if (eventId === 'round:end') set({ start: false })
    if (eventId === 'deck:flop') set({ table: [...payload, null, null] })
    if (eventId === 'deck:turn') set({ table: [...payload, null] })
    if (eventId === 'deck:river') set({ table: payload })
    if (eventId === 'round:end') set({ table: null, start: false })
  },
  eventSender: null,
  setEventSender: (eventSender) => set({ eventSender }),
}))

export const useEventSender = () => {
  const eventSender = useTableStore((state) => state.eventSender)
  return (eventId: string, payload: Record<string, any>) => {
    if (eventSender === null) {
      console.error('Event sender is null')
      return
    }
    eventSender({ eventId, payload })
  }
}
