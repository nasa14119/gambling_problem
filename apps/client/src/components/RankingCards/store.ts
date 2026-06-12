import { create } from 'zustand'

type Store = {
  state: 'idle' | 'open' | 'close'
  setState: (state?: Store['state']) => void
}
export const useRankCards = create<Store>((set) => ({
  state: 'idle',
  setState: (param) =>
    set(({ state }) => ({
      state:
        typeof param !== 'undefined'
          ? param
          : state === 'open'
            ? 'close'
            : 'open',
    })),
}))

export const useRankCardsTrigger = () => {
  return useRankCards((s) => s.setState)
}

export const useRankCardsValue = () => useRankCards((s) => s.state)
