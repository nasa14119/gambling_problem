import { create } from 'zustand'

type Store = {
  state: 'idle' | 'open' | 'close'
  setState: (state?: Store['state']) => void
}
export const usePockerFace = create<Store>((set) => ({
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

export const usePockerFaceTrigger = () => {
  return usePockerFace((state) => state.setState)
}
