import { NextCards } from '#/components/NextCards'
import { OtherPlayer } from '#/components/OtherPlayer'
import { Pot } from '#/components/Pot'
import { StartGameBtn } from '#/components/StartGameBtn'
import { TableWithStore } from '#/components/TableWithStore'
import { UserCards } from '#/components/UserCards'
import { useGameEvents } from '#/hooks/useGameEvents'
import { useGameState } from '#/stores/gameStore'

export function MainGame() {
  const game = useGameState()
  useGameEvents()
  const user = game.user
  const keys = Object.keys(game.players).filter((k) => k !== user.playerId)
  return (
    <div className="bg-green-950 rounded-4xl size-full p-2 text-white">
      <OtherPlayer
        cards={null}
        playerId={keys[0]}
        className="absolute top-[40%] left-[5%]"
      />
      <OtherPlayer
        cards={null}
        playerId={keys[1]}
        className="absolute top-[40%] right-[5%]"
      />
      <OtherPlayer
        cards={null}
        playerId={keys[2]}
        className="absolute bottom-[25%] left-[11%]"
      />
      <OtherPlayer
        cards={null}
        playerId={keys[3]}
        className="absolute bottom-[25%] right-[11%]"
      />
      <UserCards />
      <TableWithStore className="absolute inset-x-0 justify-center top-[15%]" />
      <NextCards className="absolute right-[5%] top-[12%]" />
      <Pot />
      <StartGameBtn />
    </div>
  )
}
