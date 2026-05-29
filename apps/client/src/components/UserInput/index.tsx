import { Chip } from '#/components/UserInput/Chip'
import { cn } from '#/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'

type Props = {
  currentBet: number
  handleChip: (key: number) => (num: number) => void
  chips: number
  minBet: number
}
export function UserInput({ currentBet, handleChip, chips, minBet }: Props) {
  return (
    <div className="flex flex-col justify-end my-1 relative  px-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'bg-cyan-800/50 rounded-4xl text-center py-1 text-xs mx-1',
              currentBet > chips && 'opacity-50',
            )}
          >
            Your bet {currentBet}
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-gray-950">
          <span className="capitalize text-gray-300 text-xs">
            min bet {minBet}
          </span>
        </TooltipContent>
      </Tooltip>
      <div className="flex justify-center relative gap-x-1.5 py-2">
        <Chip className="bg-cyan-700" chips={10} onClick={handleChip(10)} />
        <Chip className="bg-cyan-600" chips={100} onClick={handleChip(50)} />
        <Chip className="bg-cyan-500" chips={200} onClick={handleChip(100)} />
      </div>
    </div>
  )
}
