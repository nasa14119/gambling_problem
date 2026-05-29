import { useCanPayDebt, useIncrementPay } from '#/components/Bank/store'
import { cn } from '#/lib/utils'

export function PayBtn() {
  const handleClick = useIncrementPay()
  const canPay = useCanPayDebt()
  const isDisabled = !canPay
  return (
    <button
      className={cn(
        'font-black rounded-4xl px-5  text-white bg-blue-950  py-1 leading-3.75 active:outline-none',
        isDisabled && ' text-gray-500 bg-gray-300 opacity-20 ',
      )}
      disabled={isDisabled}
      onClick={handleClick}
    >
      Pay +500
    </button>
  )
}
