import type { Card } from '@repo/types'
import { create } from 'zustand'

type Store = {
  nextCard: Card | null
  isDisable: boolean
  setCard: (card: Card) => void
}
export const useStoreNextCard = create<Store>((set) => ({
  isDisable: false,
  nextCard: null,
  setCard: (card) => set({ nextCard: card }),
}))

export const useResetNext = () => {
  return useStoreNextCard.setState({ isDisable: false, nextCard: null })
}

export const useDisableShuffle = () => {
  return (disable?: boolean) => {
    if (typeof disable === 'boolean') {
      useStoreNextCard.setState({ isDisable: disable })
      return
    }
    useStoreNextCard.setState({ isDisable: true })
  }
}

export const useNextCardSetter = () => useStoreNextCard((s) => s.setCard)
