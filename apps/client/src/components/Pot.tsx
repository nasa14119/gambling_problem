import { useGameState } from '#/stores/gameStore'

export function Pot() {
  const { pot } = useGameState()
  return (
    <>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 flex flex-col text-center">
        <div>Money Pot</div>
        <div>{pot ?? 0}</div>
      </div>
    </>
  )
}
