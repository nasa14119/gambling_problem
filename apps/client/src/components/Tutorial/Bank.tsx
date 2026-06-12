import { HeaderBank } from '#/components/Bank/HeaderBank'
import type { SubmitFunction } from '#/components/Convertion'
import { Balance } from '#/components/Tutorial/Balance'
import { ConvertionTutorial } from '#/components/Tutorial/ConvertionTutorial'
import { PaymentInfo } from '#/components/Tutorial/PaymentInfo'
import { useState } from 'react'

export function Bank() {
  const [chips, setChip] = useState(1000)
  const [money, setMoney] = useState(1000)
  const [pay, setPay] = useState(0)
  const handleSubmit: SubmitFunction = (key, value) => {
    if (key === 'money') {
      console.log(value)
      setMoney((p) => p - value)
      setChip((p) => p + value)
      return
    }
    setMoney((p) => p + value)
    setChip((p) => p - value)
  }
  return (
    <div className="bg-black size-full rounded-4xl flex flex-col px-[5%] py-[2%] gap-y-5">
      <HeaderBank />
      <PaymentInfo
        money={money}
        chips={chips}
        setMoney={setMoney}
        pay={pay}
        setPay={setPay}
      />
      <Balance chips={chips} money={money} pay={pay} />
      <ConvertionTutorial change={handleSubmit} chips={chips} money={money} />
    </div>
  )
}
