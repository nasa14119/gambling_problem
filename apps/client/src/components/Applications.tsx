import { ApplicationsRight } from '#/components/ApplicationsRight'
import { usePause } from '#/components/PauseScreen/store'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, PropsWithChildren } from 'react'

type PropsAplications = PropsWithChildren
export function Applications({ children }: PropsAplications) {
  const pause = usePause()
  return (
    <footer className="py-2 px-5 min-h-[5vh] bg-gray-800 flex gap-x-5 items-center">
      <Tooltip>
        <TooltipTrigger
          className="aspect-square size-11 p-3 rounded-full bg-gray-400/20"
          onClick={pause}
        >
          <svg
            viewBox="0 0 88 88"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full"
          >
            <path
              d="m0 12.402 35.687-4.86.016 34.423-35.67.203zm35.67 33.529.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349-.011 41.34-47.318-6.678-.066-34.739z"
              fill="var(--color-gray-400)"
            />
          </svg>
        </TooltipTrigger>
        <TooltipContent className="text-gray-900">
          <span className="text-white capitalize">pause</span>
        </TooltipContent>
      </Tooltip>
      {children}
      <ApplicationsRight />
    </footer>
  )
}

type PropsApplication = {
  tooltip?: string
  Icon: LucideIcon
} & ComponentProps<'div'>
export function Application({ Icon, tooltip, ...rest }: PropsApplication) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="aspect-square relative hover:bg-gray-200/10 flex-col flex justify-between items-center p-2 rounded-sm z-50"
          {...rest}
        >
          <Icon className=" text-gray-400 size-8" />
          <span className="w-1 bg-white/50 rounded-full aspect-square"></span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-gray-900">
        <span className="capitalize text-white">{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  )
}
