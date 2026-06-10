import { NavItem } from '#/components/Nav/NavItem'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { Spade } from 'lucide-react'

export function LandingNav() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavItem
          type="fill"
          className="px-2 font-semibold tracking-wide text-2xl aspect-square flex items-center justify-center rounded-full"
          to="/landing"
        >
          <Spade className="size-5" />
        </NavItem>
      </TooltipTrigger>
      <TooltipContent className="text-accent">
        <span className="text-white text-xs">Landing</span>
      </TooltipContent>
    </Tooltip>
  )
}
