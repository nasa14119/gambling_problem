import { CreditDueDate } from '#/components/Bank/CreditDueDate'
import { PayBtn } from '#/components/Bank/PayBtn'
import { Rank } from '#/components/Bank/Rank'
import {
  usePayPercent,
  useRankBank,
  useRoundsLeft,
} from '#/components/Bank/store'

export function PaymentInfo() {
  const total_pay = usePayPercent()
  const rounds = useRoundsLeft()
  const rank = useRankBank()
  return (
    <div className="grid  grid-cols-2 gap-x-10 h-2/5 overflow-hidden">
      <CreditDueDate total_pay={total_pay} rounds={rounds}>
        <PayBtn />
      </CreditDueDate>
      <Rank rank={rank} />
    </div>
  )
}
