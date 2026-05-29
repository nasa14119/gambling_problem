import { useCanPayDebt, useIncrementPay } from '#/components/Bank/store'
import { cn } from '#/lib/utils'

export function PayBtn() {
  const handleClick = useIncrementPay()
  const canPay = useCanPayDebt()
  const isDisabled = !canPay
  return (
    <button
      className={cn(
        'font-black rounded-sm px-5   border-2 border-current border-dashed  py-1 leading-3.75 active:outline-none',
        isDisabled && ' text-gray-500 opacity-20 ',
      )}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <span className="text-white">Pay +500</span>
    </button>
  )
}
