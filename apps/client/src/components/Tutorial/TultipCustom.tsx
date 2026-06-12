import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import type { ComponentProps, PropsWithChildren } from 'react'

type Props = {
  text: string
  side?: 'right' | 'left' | 'bottom' | 'top'
  color?: string
} & PropsWithChildren &
  Omit<ComponentProps<typeof TooltipTrigger>, 'asChild'>

export function TooltipCustom({
  text,
  children,
  color = 'var(--color-slate-950)',
  side = 'top',
  ...rest
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild {...rest}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} style={{ color }}>
        <span className="text-white">{text}</span>
      </TooltipContent>
    </Tooltip>
  )
}

type PropsDark = Omit<ComponentProps<typeof TooltipCustom>, 'color'>

export function TooltipDark(props: PropsDark) {
  return <TooltipCustom color="var(--color-blue-950)" {...props} />
}
