import type { Card, PlayerHand } from '@repo/types'
import type { GameEventPayloads, PlayerData } from '@repo/types/server'

export type ClientEvents = Omit<
  GameEventPayloads,
  'deck:cards_deal' | 'round:winners'
> & {
  'user:turn': PlayerData
  'deck:cards_deal': PlayerHand
  'round:winners': {
    winners: (PlayerData & { for: string })[]
    gameState: Card[]
    moneyWin: number
  }
}

export type GameEventsClient = keyof ClientEvents

export type EventPayload<T extends GameEventsClient> = {
  eventId: T
  payload?: ClientEvents[T]
}
export type EventSender = (event: EventPayload<GameEventsClient>) => void
export type EventData = {
  [K in GameEventsClient]: {
    eventId: K
    payload: ClientEvents[K]
  }
}[GameEventsClient]
