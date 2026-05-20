import { create } from 'zustand'

type Store = {
  state: boolean
  setState: (state?: boolean) => void
}
export const usePockerFace = create<Store>((set) => ({
  state: false,
  setState: (param) =>
    set(({ state }) => ({
      state: typeof param === 'boolean' ? param : !state,
    })),
}))

export const usePockerFaceTrigger = () => {
  return usePockerFace((state) => state.setState)
}
