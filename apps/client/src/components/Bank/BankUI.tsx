import { Actions } from '#/components/Bank/Actions'
import { ChipsBank } from '#/components/Bank/Chips'
import { Credit } from '#/components/Bank/Credit'
import { MoneyBalance } from '#/components/Bank/MoneyBalance'
import { PaymentInfo } from '#/components/Bank/PaymentInfo.tsx'
import { Skeleton } from '#/shadcn/ui/skeleton.tsx'
import { useEffect } from 'react'
import { useBankLoading } from './store.ts'
import { fetchData } from './store'
import { HeaderBank } from '#/components/Bank/HeaderBank.tsx'

export function BankUI() {
  return (
    <div className="bg-neutral-950 rounded-4xl size-full p-2  text-green-500 flex flex-col justify-between py-[5%] px-10 gap-y-5">
      <HeaderBank />
      <PaymentInfo />
      <div className="grid grid-cols-3 gap-x-2 h-[10vh]">
        <Credit />
        <ChipsBank />
        <MoneyBalance />
      </div>
      <Actions />
    </div>
  )
}
export const Bank = () => {
  const isLoading = useBankLoading()
  useEffect(() => {
    fetchData()
  }, [])
  if (isLoading) return <Loanding />
  return <BankUI />
}
function Loanding() {
  return (
    <div className="grid grid-cols-4 gap-10 size-full bg-black px-[5%] py-[2%] rounded-4xl">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="size-full border-2 border-white border-dashed bg-white/10"
        />
      ))}
    </div>
  )
}
