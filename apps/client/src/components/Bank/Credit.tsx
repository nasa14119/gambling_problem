import { usePayedBank } from '#/components/Bank/store'
import { cn, formatCurrency } from '#/lib/utils'

export function Credit() {
  const pay = usePayedBank()
  return (
    <div className="flex justify-start text-[5vh] flex-col leading-8.75">
      <div
        className={cn(
          'p-4 rounded-xl bg-red-50 flex flex-col size-full',
          pay <= 0 && 'bg-white',
        )}
      >
        <span className="text-base font-semibold ">Debt</span>
        {pay > 0 && (
          <span className="ml-auto text-red-700">-{formatCurrency(pay)}</span>
        )}
        {pay <= 0 && <span className="ml-auto text-blue-950">0</span>}
      </div>
    </div>
  )
}
