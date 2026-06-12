import { cn } from '#/lib/utils'

type Props = {
  rounds: number
}
export function RoundIndicator({ rounds }: Props) {
  const isLow = rounds <= 5
  return (
    <span
      className={cn(
        'rounded-full border-2 border-current border-dashed font-bold p-1 text-[16px] h-full aspect-square flex items-center',
        isLow && 'text-red-700',
      )}
    >
      <span className={cn('text-white', isLow && 'text-red-700')}>
        {rounds}
      </span>
    </span>
  )
}
