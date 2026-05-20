import { NextCards } from '#/components/NextCards'
import { OtherPlayer } from '#/components/OtherPlayer'
import { Table } from '#/components/Table'
import { UserCards } from '#/components/UserCards'

export function MainGame() {
  return (
    <div className="bg-green-950 rounded-4xl size-full p-2 text-white">
      <OtherPlayer
        cards={null}
        playerId="player:1"
        className="absolute top-[40%] left-[5%]"
      />
      <OtherPlayer
        cards={null}
        playerId="player:2"
        className="absolute top-[40%] right-[5%]"
      />
      <OtherPlayer
        cards={null}
        playerId="player:1"
        className="absolute bottom-[25%] left-[11%]"
      />
      <OtherPlayer
        cards={null}
        playerId="player:2"
        className="absolute bottom-[25%] right-[11%]"
      />
      <UserCards />
      <Table
        className="absolute inset-x-0 justify-center top-[15%]"
        table={null}
      />
      <NextCards className="absolute right-[5%] top-[12%]" />
    </div>
  )
}
