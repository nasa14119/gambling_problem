import { useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  items: (({ ...args }) => ReactNode)[]
}
function Indicator() {
  return (
    <div>
      <span
        className="text-2xl text-[#00FDFF] typewriter-text"
        style={{ '--duration': `${2.75}s` } as any}
      >
        press <span className="text-[#E5E500]">(&nbsp;r&nbsp;)</span> to restart
        the pc and the game&nbsp;&nbsp;
      </span>
    </div>
  )
}
export function Content({ items }: Props) {
  const [values, setValues] = useState([items[0]])
  const [index, setIndex] = useState(1)
  const handleAnimation = () => {
    if (index >= items.length) {
      setValues((prev) => [...prev, Indicator])
      return
    }
    setValues((prev) => [...prev, items[index]])
    setIndex((p) => p + 1)
  }
  return (
    <div className="size-full  px-10 pb-[5%] flex flex-col items-start justify-end">
      {values.map((Item, i) => (
        <Item key={i} onEnd={handleAnimation} />
      ))}
    </div>
  )
}
