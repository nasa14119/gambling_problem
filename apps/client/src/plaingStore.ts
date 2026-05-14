import { create } from 'zustand'

type PlaingStore = {
  players: Partial<
    Record<
      string,
      ({ eventId, payload }: { eventId: string; payload: any }) => void
    >
  >
  turn: string | null
  setPlayers: (id: string, players: PlaingStore['players'][string]) => void
  setTurn: (id: string) => void
}
export const usePlaingStore = create<PlaingStore>((set) => ({
  players: {},
  turn: null,
  setPlayers: (id, fun) => {
    set(({ players }) => {
      players[id] = fun
      return { ...players }
    })
  },
  setTurn: (id) => set({ turn: id }),
}))

export const useUpdatePlayer = (
  id: string,
  fun: PlaingStore['players'][string],
) => {
  const setPlayer = usePlaingStore((state) => state.setPlayers)
  setPlayer(id, fun)
  const setTurn = usePlaingStore((state) => state.setTurn)
  return { setTurn: () => setTurn(id) }
}

export const useEventSender = () => {
  const eventSender = usePlaingStore((state) => state.players)
  const turn = usePlaingStore((state) => state.turn)
  if (!turn) return null
  if (!eventSender[turn]) return null
  return eventSender[turn]
}
