import { useBankChips } from '#/components/Bank/store'
import { formatCurrency } from '#/lib/utils'

export function ChipsBank() {
  const balance = useBankChips()
  return (
    <div className="flex justify-start text-[5vh] flex-col leading-8.75">
      <div className="p-4 rounded-xl border-2 border-current border-dashed flex flex-col">
        <span className="text-base font-semibold ">Chips</span>
        <span className="ml-auto">{formatCurrency(balance)}</span>
      </div>
    </div>
  )
}
