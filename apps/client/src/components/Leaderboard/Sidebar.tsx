import { StateBtnExplioitsUsed } from '#/components/Leaderboard/ExploitsChart/ChangeView'
import { ChangeViewTable } from '#/components/Leaderboard/ExploitsChart/ChangeViewTable'
import { StateBtn } from '#/components/Leaderboard/TableBest/components/StateBtn'
<<<<<<< Updated upstream
import { useAuth } from '#/components/Login/store'
import { Link } from '@tanstack/react-router'
import { ChartNoAxesCombined } from 'lucide-react'

=======
>>>>>>> Stashed changes
export function Sidebar() {
  const { isLogged } = useAuth()
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
        <div className="flex flex-col gap-2 h-full">
          <StateBtnExplioitsUsed state="all_time">
            All time
          </StateBtnExplioitsUsed>
          <ChangeViewTable state="board" table="full">
            In the best 50 runs
          </ChangeViewTable>
          <ChangeViewTable state="player" table="unique">
            By the best players
          </ChangeViewTable>
          {isLogged && (
            <Link
              to="/user-stads"
              className="mt-auto w-full text-center border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-250 ease py-2 rounded-4xl flex gap-x-2 justify-center items-center"
            >
              <span>See Your Stads</span>
              <ChartNoAxesCombined className="size-5" />
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
