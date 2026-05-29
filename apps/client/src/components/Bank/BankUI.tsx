import { Actions } from '#/components/Bank/Actions'
import { ChipsBank } from '#/components/Bank/Chips'
import { Credit } from '#/components/Bank/Credit'
import { MoneyBalance } from '#/components/Bank/MoneyBalance'
import { Pay } from '#/components/Bank/Pay'
import { Skeleton } from '#/shadcn/ui/skeleton.tsx'
import { useEffect } from 'react'
import { useBankLoading } from './store.ts'
import { fetchData } from './store'

export function BankUI() {
  return (
    <div className="bg-neutral-950 rounded-4xl size-full p-2  text-green-500 flex flex-col justify-between py-[10vh] px-10">
      <div className="h-[10vh] flex ">
        <span className="rounded-sm border-2 border-dashed border-green-500 h-full w-[20%] grid place-content-center">
          LOGO
        </span>
      </div>
      <Pay />
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
