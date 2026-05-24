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
    <div className="bg-green-950 rounded-4xl size-full p-2 text-white relative">
      <div className="absolute inset-x-0 flex justify-center top-0 pt-2">
        <TableWithStore />
      </div>
      <div className="absolute top-[15%] inset-x-0">
        <div className="flex justify-between px-[9%]">
          <OtherPlayer playerId={keys[0]} className="" />
          <OtherPlayer playerId={keys[1]} className="" position="left" />
        </div>
        <div className="flex justify-between px-[15%] py-2">
          <OtherPlayer playerId={keys[2]} className="" />
          <OtherPlayer playerId={keys[3]} position="left" />
        </div>
      </div>
      <UserCards />
      <Pot />
      <StartGameBtn />
    </div>
  )
}
