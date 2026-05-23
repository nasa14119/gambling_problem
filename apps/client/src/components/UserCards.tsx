import { ChipsDisplay } from '#/components/ChipsDisplay'
import { PlayerCard } from '#/components/PlayerCard'
import { UserInput } from '#/components/UserInput'
import { useIsActive } from '#/hooks/useIsActive'
import { useUserEvents } from '#/hooks/useUserEvents'
import { cn } from '#/lib/utils'
import { useEventSender } from '#/stores/eventsStore'
import { useGameState } from '#/stores/gameStore'
import type { TurnOptions } from '@repo/types'
import { useState } from 'react'
import type { ComponentProps } from 'react'

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
    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-x-2 ">
      <PlayerCard
        cards={user.cards}
        scale={1.5}
        hasFold={user.isFold}
        isActive={isActive}
      />
      <div className="flex flex-col justify-end py-1 gap-y-1">
        {turn && isActive && (
          <Options
            minBet={turn.minBet - (user.currentBet ?? 0)}
            currentBet={currentBet}
            setOpt={handleOpt}
          />
        )}

        <ChipsDisplay chips={user.chips} />
      </div>
      {turn && isActive && (
        <UserInput
          minBet={turn.minBet - (user.currentBet ?? 0)}
          currentBet={currentBet}
          handleChip={handleChip}
          chips={user.chips}
        />
      )}
    </div>
  )
}
function Option({
  value,
  className,
  ...rest
}: { value: string } & ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-gray-300/20 p-0.5 px-3 rounded-4xl flex gap-x-2 text-xs text-center justify-center capitalize font-medium',
        className,
      )}
      {...rest}
    >
      {value}
    </div>
  )
}
function Options({
  minBet,
  setOpt,
  currentBet,
}: {
  minBet: number
  setOpt: (key: TurnOptions) => void
  currentBet: number
}) {
  return (
    <>
      {currentBet === minBet && (
        <Option
          value="pay"
          className="bg-blue-500/70"
          onClick={() => setOpt('pay')}
        />
      )}
      {currentBet > minBet && (
        <Option
          value="raise"
          className="bg-green-500/70"
          onClick={() => setOpt('raise')}
        />
      )}
      {!minBet && (
        <Option
          value="check"
          className="bg-yellow-500"
          onClick={() => setOpt('check')}
        />
      )}
      <Option
        value="fold"
        className="bg-red-500/70"
        onClick={() => setOpt('fold')}
      />
    </>
  )
}
