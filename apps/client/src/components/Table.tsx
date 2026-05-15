import { Card } from '#/components/Card'
import { CardCover } from '#/components/CardCover'
import { useTableStore } from '#/store'

const SCALE = 1.7
export function Table() {
  const table = useTableStore((state) => state.table)
  if (!table) {
    return (
      <div className="flex gap-x-2">
        {Array.from({ length: 5 }, (_, i) => (
          <CardCover scale={SCALE} key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-x-2">
      {table[0] ? (
        <Card card={table[0]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[1] ? (
        <Card card={table[1]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[2] ? (
        <Card card={table[2]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[3] ? (
        <Card card={table[3]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
      {table[4] ? (
        <Card card={table[4]} scale={SCALE} />
      ) : (
        <CardCover scale={SCALE} />
      )}
    </div>
  )
}
