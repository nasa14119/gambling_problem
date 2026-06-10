import { cn } from '#/lib/utils'
import {
  ArrowRight,
  ChartNoAxesCombined,
  DoorOpen,
  Power,
  User2,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { Link, useRouter } from '@tanstack/react-router'
import { useAuth, useAuthValidate } from '#/components/Login/store'
import { useLogout } from '#/hooks/useLogout'
import { RestoreDialog } from '#/components/RestoreDialog'
import { fetchNewGame } from '#/lib/fetch'
import { LoadGameBtn } from '#/components/UserPage/LoadGameBtn'
import { NavBar } from '#/components/Nav/NavBar'

export function UserPage() {
  const { playerId } = useAuth()
  const logout = useLogout()
  const { navigate } = useRouter()
  const handleNewGame = async () => {
    const data = await fetchNewGame()
    localStorage.setItem('gameState', JSON.stringify(data))
    navigate({ to: '/game' })
  }
  useAuthValidate()
  return (
    <header className={cn('w-screen h-screen relative z-0')}>
      <NavBar className="absolute inset-x-0" />
      <div className={cn('size-full flex flex-col gap-y-5 justify-center')}>
        <div className="grid place-content-center">
          <User2 className="size-[25vh] text-current p-5 bg-current/20 rounded-full" />
        </div>
        <div>
          <h1 className="text-center text-6xl font-bold capitalize">
            {playerId}
          </h1>
        </div>
        <div className="*:py-1">
          <div className="h-[5vh] w-[20vw] grid grid-cols-[1fr_min-content] mx-auto ">
            <span className="text-xl pl-2 border border-slate-800 border-r-0 flex items-center size-full bg-slate-100 min-w-40">
              Reset game
            </span>
            <Tooltip>
              <RestoreDialog onAccept={handleNewGame}>
                <TooltipTrigger asChild>
                  <button className="bg-slate-300 aspect-12/9 border border-slate-800 grid place-content-center">
                    <ArrowRight className="size-5" />
                  </button>
                </TooltipTrigger>
              </RestoreDialog>
              <TooltipContent className="text-current" side="right">
                <span className="text-white">Reset</span>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="h-[5vh] w-[20vw] grid grid-cols-[1fr_min-content] mx-auto ">
            <span className="text-xl pl-2 border border-slate-800 border-r-0 flex items-center size-full bg-slate-100 min-w-40">
              Load game
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <LoadGameBtn />
              </TooltipTrigger>
              <TooltipContent className="text-current" side="right">
                <span className="text-white">Start</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 inset-x-0 flex justify-between  pb-2 px-5">
        <div className={cn('flex gap-x-2 items-center')}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-3xl px-2 hover:bg-slate-950/10 transition-all duration-250 ease rounded-sm min-w-fit">
                <div>Your Runs</div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-slate-950">
              <span className="text-white">See the runs saved</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center justify-center hover:bg-slate-950/10 py-2 transition-all duration-250 ease rounded-sm h-full aspect-square "
              onClick={logout}
            >
              <DoorOpen className="size-10" />
            </TooltipTrigger>
            <TooltipContent className="text-slate-950">
              <span className="text-white">Logout</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center justify-center hover:bg-slate-950/10 py-2 transition-all duration-250 ease rounded-sm h-full aspect-square "
              asChild
            >
              <Link to="/user-stads">
                <ChartNoAxesCombined className="size-10" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-slate-950">
              <span className="text-white">See your stads</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-x-2 items-center">
          <Link to="/">
            <Power
              className={cn(
                'size-12 text-black opacity-10 transition-all duration-1000 ease',
              )}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
