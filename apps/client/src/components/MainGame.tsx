import { OtherPlayer } from '#/components/OtherPlayer'
import { Pot } from '#/components/Pot'
import { StartGameBtn } from '#/components/StartGameBtn'
import { TableWithStore } from '#/components/TableWithStore'
import { UserCards } from '#/components/UserCards'
import { ExploitsSuit } from '#/exploits/ExploitsSuit'
import { useGameEvents } from '#/hooks/useGameEvents'
import { useGameState } from '#/stores/gameStore'
import tableBackground from '#/assets/greenPokerTable.png'
import { useSoundOnLoad } from '#/hooks/useSound/useSoundOnLoad'
import music from '#/assets/soundEffects/Nivel_1_lobby.mp3'

export function MainGame() {
  const game = useGameState()
  useSoundOnLoad(music)
  useGameEvents()
  const user = game.user
  const keys = Object.keys(game.players).filter((k) => k !== user.playerId)
  return (
    <div className="rounded-[100px] size-full p-2 text-white relative overflow-hidden">
      <div className='bg-red-100 absolute inset-0'>
        <img src={tableBackground} className='size-full object-fill [image-rendering: pixelated] '/>
      </div>
      <ExploitsSuit />
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
