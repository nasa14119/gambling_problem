import { ExploitsChart } from '#/components/Leaderboard/ExploitsChart'
import { TableBest } from '#/components/Leaderboard/TableBest'
import { UserRow } from '#/components/Leaderboard/TableBest/UserRow'

export function MainLeaderboard() {
  return (
    <div className="px-2 grid grid-cols-1 h-full grid-rows-2 pb-10 gap-y-5">
      <div className="max-h-full overflow-hidden pt-2 grid grid-cols-1 grid-rows-[auto_1fr_auto]">
        <h2 className="text-lg flex leading-4 mb-2 font-medium">Best Scores</h2>
        <TableBest />
        <UserRow />
      </div>
      <div>
        <h2 className="text-lg flex leading-4 mb-2 font-medium">
          Most Used Exploits
        </h2>
        <ExploitsChart />
      </div>
    </div>
  )
}
