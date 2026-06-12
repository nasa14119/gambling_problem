import { Convertion } from '#/components/Convertion'
import { TooltipDark } from '#/components/Tutorial/TultipCustom'
import type { SubmitFunction } from '#/components/Convertion'

type Props = {
  chips: number
  money: number
  change: SubmitFunction
}
export function ConvertionTutorial({ chips, money, change }: Props) {
  return (
    <div className="h-1/3 flex gap-x-10 justify-between text-green-600">
      <TooltipDark text="This is where you transfer your money into chips">
        <Convertion
          title="Frecuent Transfer"
          onChange={change}
          maxValue={money}
          type="money"
          className="w-full"
        />
      </TooltipDark>
      <TooltipDark text="This is where you can change you chips to money">
        <Convertion
          title="Chips Convertion"
          onChange={change}
          maxValue={chips}
          type="chips"
          className="w-full"
        />
      </TooltipDark>
    </div>
  )
}
