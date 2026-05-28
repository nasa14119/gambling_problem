import { useIncrementPay, usePayPercent } from '#/components/Bank/store'
import { cn } from '#/lib/utils'

export function PayBtn() {
  const handleClick = useIncrementPay()
  const percent = usePayPercent()
  return (
    <button
      className={cn(
        'font-black rounded-4xl px-5  text-white bg-blue-950  py-1 leading-3.75 active:outline-none',
        percent === 100 && ' text-gray-500 bg-gray-300 opacity-20 ',
      )}
      disabled={percent === 100}
      onClick={handleClick}
    >
      Pay +5000
    </button>
  )
}
