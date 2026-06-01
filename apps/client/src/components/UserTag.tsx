import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { useGameState } from '#/stores/gameStore'

export function UsertTag() {
  const { user } = useGameState()
  if (user.playerId === 'player:guest') return <DemeMessage />
  return (
    <div className="px-2 font-bold text-white/20 bg-gray-900/20 rounded-4xl">
      {user.playerId}
    </div>
  )
}
function DemeMessage() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="font-bold text-gray-800 bg-white px-4 py-1 rounded-4xl uppercase">
          demo
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-gray-900">
        <span className="text-white"> You current run will not be saved</span>
      </TooltipContent>
    </Tooltip>
  )
}
