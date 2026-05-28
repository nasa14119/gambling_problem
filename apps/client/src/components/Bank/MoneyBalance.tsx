import { useBankMoney } from '#/components/Bank/store'
import { formatCurrency } from '#/lib/utils'

export function MoneyBalance() {
  const balance = useBankMoney()
  return (
    <div className="flex justify-start text-[5vh] flex-col leading-8.75">
      <div className="p-4 rounded-xl bg-white flex flex-col">
        <span className="text-base font-semibold ">Balance</span>
        <span className="ml-auto">{formatCurrency(balance)}</span>
      </div>
    </div>
  )
}
