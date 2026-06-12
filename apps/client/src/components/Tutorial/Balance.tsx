import {
  MoneyInfo,
  MoneyInfoHeder,
  MoneyInfoNumber,
} from '#/components/Bank/MoneyInfo'
import { TooltipDark } from '#/components/Tutorial/TultipCustom'
import { cn } from '#/lib/utils'

type Props = {
  money: number
  chips: number
  pay: number
}

export function Balance({ money, chips, pay }: Props) {
  const debt = -1000 + pay
  return (
    <div className="h-1/5 w-full grid grid-cols-3 gap-x-5 text-white">
      <TooltipDark text="Here is the amount of dept you are still mising to pay">
        <MoneyInfo className=" text-green-500">
          <MoneyInfoHeder>Debt</MoneyInfoHeder>
          <MoneyInfoNumber
            className={cn('text-red-700', debt >= 0 && 'text-blue-800')}
            value={debt}
          />
        </MoneyInfo>
      </TooltipDark>
      <TooltipDark text="Here are the chips you have that is te currency that you use for betting in the game">
        <MoneyInfo className=" text-green-500">
          <MoneyInfoHeder>Chips</MoneyInfoHeder>
          <MoneyInfoNumber value={chips} />
        </MoneyInfo>
      </TooltipDark>

      <TooltipDark text="Money is the currency that is safe from the casino and the one you use for exploits">
        <MoneyInfo className=" text-green-500">
          <MoneyInfoHeder>Money</MoneyInfoHeder>
          <MoneyInfoNumber value={money} />
        </MoneyInfo>
      </TooltipDark>
    </div>
  )
}
