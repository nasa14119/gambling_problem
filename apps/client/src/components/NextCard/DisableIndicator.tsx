import { cn } from '#/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { Snowflake } from 'lucide-react'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'div'>
export function DisableIndicator({ ...rest }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('p-1 rounded-full bg-blue-200', rest.className)}>
          <Snowflake className="size-5 text-blue-500" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-blue-200">
        <span className="text-xs text-blue-500 font-bla}">
          Card shuffuling is disable{' '}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
