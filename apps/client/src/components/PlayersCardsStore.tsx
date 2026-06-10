import type { PlayerHand } from '@repo/types'
import { create } from 'zustand'

type Element = { player: string; card: PlayerHand }

type Store = {
  cards: { [key: string]: PlayerHand }
  setCard: (value: Element) => void
}
const useCardsStore = create<Store>((set) => ({
  cards: {},
  setCard: (value) => set((p) => ({ ...p.cards, [value.player]: value.card })),
}))

export const useCardsClear = () => {
  return () => useCardsStore.setState({ cards: {} })
}

export const useCardValue = (playerId: string) => {
  const cards = useCardsStore((s) => s.cards)
  const setCard = useCardsStore((s) => s.setCard)
  return [
    cards[playerId],
    (card: PlayerHand) => setCard({ player: playerId, card }),
  ] as const
}
