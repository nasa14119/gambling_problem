import type { Card } from '@repo/types'
import { create } from 'zustand'

type WinnerPayload = {
  moneyWin: number
  gameState: Card[]
  winners: {
    playerId: string
    money: number
    chips: number
    for: string
  }[]
}
type TableStore = {
  table: Card[] | null
  start: boolean
  moneyPot: number
  eventSender: ((payload: any) => void) | null
  setTable: (table: Card[]) => void
  setRound: (eventId: string, payload: any) => void
  setEventSender: (eventSender: (payload: any) => void) => void
  winners: WinnerPayload | null
}
export const useTableStore = create<TableStore>((set) => ({
  table: null,
  start: false,
  moneyPot: 0,
  winners: null,
  setTable: (table) => set({ table }),
  setRound: (eventId, payload) => {
    if (eventId === 'round:start')
      set({ start: true, moneyPot: 0, winners: null, table: null })
    if (eventId === 'round:end') set({ start: false })
    if (eventId === 'deck:flop') set({ table: [...payload, null, null] })
    if (eventId === 'deck:turn') set({ table: [...payload, null] })
    if (eventId === 'deck:river') set({ table: payload })
    if (eventId === 'round:end') set({ start: false })
    if (eventId === 'turn:end')
      set(({ moneyPot }) => ({
        moneyPot: moneyPot + payload.moneyPot,
      }))
    if (eventId === 'round:winners')
      set(() => ({
        winners: {
          winners: payload.winners,
          moneyWin: payload.moneyWin,
          gameState: payload.gameState,
        },
      }))
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
