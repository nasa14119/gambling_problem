import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'
import { useTableStore } from '#/store'

export function Table() {
  const table = useTableStore((state) => state.table)
  if (!table) {
    return (
      <div className="flex gap-x-2">
        {Array.from({ length: 5 }, (_, i) => (
          <CardCover scale={2} key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-x-2">
      {table[0] ? <Card card={table[0]} scale={2} /> : <CardCover scale={2} />}
      {table[1] ? <Card card={table[1]} scale={2} /> : <CardCover scale={2} />}
      {table[2] ? <Card card={table[2]} scale={2} /> : <CardCover scale={2} />}
      {table[3] ? <Card card={table[3]} scale={2} /> : <CardCover scale={2} />}
      {table[4] ? <Card card={table[4]} scale={2} /> : <CardCover scale={2} />}
    </div>
  )
}
