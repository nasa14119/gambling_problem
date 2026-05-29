import { cn } from '#/lib/utils'
import { MinusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type SetBet = (num: number) => void
type Props = {
  chips: number
  onClick: SetBet
  className?: string
}
export function Chip({ className, chips, onClick }: Props) {
  const [value, setValue] = useState(0)
  const handleCllick = () => {
    setValue((prev) => prev + 1)
  }
  const handleMinus = () => {
    setValue((prev) => prev - 1)
  }
  useEffect(() => {
    if (value < 0) return
    onClick(chips * value)
  }, [value])
  return (
    <div
      className={cn(
        'aspect-square p-2 rounded-full grid place-content-center text-xs relative select-none',
        className,
      )}
      onClick={handleCllick}
    >
      <span>{chips}</span>
      {value > 0 && (
        <span
          className="absolute -bottom-1 left-0 p-1 bg-red-500 grid place-content-center rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            handleMinus()
          }}
        >
          <MinusIcon className="size-2" />
        </span>
      )}
      {value > 0 && (
        <span className="absolute -bottom-1 right-0  bg-gray-500 grid place-content-center rounded-full text-[7px] aspect-square size-4">
          {value}
        </span>
      )}
    </div>
  )
}
