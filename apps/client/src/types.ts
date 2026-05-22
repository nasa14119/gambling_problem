import type { Card, GameState, PlayerHand, TurnOptions } from '@repo/types'
import type { GameEventPayloads, PlayerData } from '@repo/types/server'

type Overwrites = keyof Pick<
  GameEventPayloads,
  | 'deck:cards_deal'
  | 'round:winners'
  | 'player:validbet'
  | 'round:start'
  | 'player:turn'
>
export type ClientEvents = Omit<GameEventPayloads, Overwrites> & {
  'user:turn': PlayerData
  'deck:cards_deal': PlayerHand
  'round:winners': {
    winners: (PlayerData & { for: string })[]
    gameState: Card[]
    moneyWin: number
  }
  'player:validbet': { player: PlayerData; type: TurnOptions; chips: number }
  'round:start': PlayerData
  'player:turn': GameState['turn']
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
