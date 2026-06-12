import { cn } from '#/lib/utils'

type Props = {
  color: string
  percentage: number
  className?: string
}
export function Slider({ color, percentage, className }: Props) {
  return (
    <div className="h-[3vh] w-full border-2 border-white border-dashed relative rounded-4xl">
      <span
        style={{
          width: `${percentage}%`,
          color,
        }}
        className={cn(
          'absolute top-0 left-0 h-full rounded-4xl border-2 border-current border-dashed transition-all duration-125 ease overflow-hidden bg-current/50',
          className,
        )}
      />
    </div>
  )
}
