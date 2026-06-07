import { StateBtnExplioitsUsed } from '#/components/Leaderboard/ExploitsChart/ChangeView'
import { StateBtn } from '#/components/Leaderboard/TableBest/components/StateBtn'

export function Sidebar() {
  return (
    <div className="px-5 pb-4">
      <main className="flex flex-col gap-y-5 size-full border border-accent/30 rounded-sm p-3 font-sans">
        <h3 className="font-light text-3xl font-base">Runs</h3>
        <div className="grid grid-cols-2 gap-2">
          <StateBtn state="full">Ended runs</StateBtn>
          <StateBtn state="players">Running</StateBtn>
          <StateBtn state="unique" className="col-span-2 mx-10">
            Unique
          </StateBtn>
        </div>
        <h3 className="font-light text-3xl font-base">Exploits</h3>
        <div className="flex flex-col gap-2">
          <StateBtnExplioitsUsed state="all_time">
            All time
          </StateBtnExplioitsUsed>
          <StateBtnExplioitsUsed state="board">
            In the best 50 runs
          </StateBtnExplioitsUsed>
          <StateBtnExplioitsUsed state="player">
            By the best players
          </StateBtnExplioitsUsed>
        </div>
      </main>
    </div>
  )
}
