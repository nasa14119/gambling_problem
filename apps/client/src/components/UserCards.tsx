import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { PlayerPot } from '#/components/PlayerPot'
import { UserInput } from '#/components/UserInput'
import { Options } from '#/components/UserInput/UserActions'
import { useIsActive } from '#/hooks/useIsActive'
import { usePlacedBet } from '#/hooks/usePlacedBet'
import { useUserEvents } from '#/hooks/useUserEvents'
import { useEventSender } from '#/stores/eventsStore'
import { useGameState } from '#/stores/gameStore'
import type { TurnOptions } from '@repo/types'
import { useState } from 'react'

export function UserCards() {
  const { user, turn } = useGameState()
  const [bet, setBet] = useState<Record<number, number>>({
    10: 0,
    100: 0,
    200: 0,
  })
  const sendEvent = useEventSender()
  useUserEvents({ playerId: user.playerId })
  const isActive = useIsActive(user.playerId)
  const currentBet = Object.values(bet).reduce((acc, val) => acc + val, 0)
  const handleChip = (key: number) => (num: number) =>
    setBet((prev) => ({ ...prev, [key]: num }))
  const placedBet = usePlacedBet()
  const handleOpt = (opt: TurnOptions) => {
    sendEvent({
      eventId: 'player:input',
      payload: {
        chips: currentBet,
        player: user.playerId,
        type: opt,
      },
    })
  }
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gapy-y-2 flex-col">
      <div className="flex gap-x-2 justify-center">
        {placedBet > 0 && (
          <div className="px-4 py-1 bg-blue-400 rounded-4xl text-xs flex items-center">
            {placedBet}
          </div>
        )}
        <PlayerPot
          playerId={user.playerId}
          position="left"
          className="static"
        />
      </div>
      <div className="flex gap-x-2">
        <PlayerCard
          cards={user.cards}
          scale={1.2}
          hasFold={user.isFold}
          isActive={isActive}
        />
        <div className="flex flex-col justify-end py-1 gap-y-1">
          {turn && isActive && (
            <Options
              minBet={turn.minBet - (turn.playersPots[user.playerId] ?? 0)}
              currentBet={currentBet}
              isInvalid={currentBet > user.chips}
              setOpt={handleOpt}
              chips={user.chips}
            />
          )}

          <ChipsDisplay chips={user.chips} side="bottom" />
        </div>
        {turn && isActive && (
          <UserInput
            minBet={turn.minBet - (turn.playersPots[user.playerId] ?? 0)}
            currentBet={currentBet}
            handleChip={handleChip}
            chips={user.chips}
          />
        )}
      </div>
    </div>
  )
}
