import { OtherPlayer } from '#/components/OtherPlayer'
import { Pot } from '#/components/Pot'
import { StartGameBtn } from '#/components/StartGameBtn'
import { TableWithStore } from '#/components/TableWithStore'
import { UserCards } from '#/components/UserCards'
import { ExploitsSuit } from '#/exploits/ExploitsSuit'
import { useGameEvents } from '#/hooks/useGameEvents'
import { useGameState } from '#/stores/gameStore'

export function MainGame() {
  const game = useGameState()
  useGameEvents()
  const user = game.user
  const keys = Object.keys(game.players).filter((k) => k !== user.playerId)
  return (
    <div className="bg-green-950 rounded-4xl size-full p-2 text-white relative">
      <ExploitsSuit />
      <div className="absolute inset-x-0 flex justify-center top-0 pt-2">
        <TableWithStore />
      </div>
      <OtherPlayer
        playerId={keys[0]}
        className="absolute top-[15%] left-[5%]"
      />
      <OtherPlayer
        playerId={keys[1]}
        className="absolute top-[15%] right-[5%]"
        position="left"
      />
      <OtherPlayer
        playerId={keys[2]}
        className="absolute top-[40%] left-[10%]"
      />
      <OtherPlayer
        playerId={keys[3]}
        className="absolute top-[40%] right-[10%]"
        position="left"
      />
      <UserCards />
      <Pot />
      <StartGameBtn />
    </div>
  )
}
