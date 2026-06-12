import {
  MoneyInfo,
  MoneyInfoHeder,
  MoneyInfoNumber,
} from '#/components/Bank/MoneyInfo'
import { useBankMoney } from '#/components/Bank/store'

export function MoneyBalance() {
  const balance = useBankMoney()
  return (
    <MoneyInfo>
      <MoneyInfoHeder>Balance</MoneyInfoHeder>
      <MoneyInfoNumber value={balance} />
    </MoneyInfo>
  )
}
