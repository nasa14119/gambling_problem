import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { Coins } from 'lucide-react'

type Props = {
  chips?: number
  side?: 'right' | 'left' | 'bottom' | 'top'
}
export function ChipsDisplay({ chips = 0, side = 'top' }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="bg-gray-300/20 py-2 px-3 rounded-4xl flex gap-x-2">
        <Coins className="size-4" />
        <span className="text-xs">{chips}</span>
      </TooltipTrigger>
      <TooltipContent className="text-gray-950" side={side}>
        <span className="capitalize text-gray-300">Chips</span>
      </TooltipContent>
    </Tooltip>
  )
}
