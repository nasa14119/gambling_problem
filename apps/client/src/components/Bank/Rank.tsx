import { useRankBank } from '#/components/Bank/store'

export function Rank() {
  const rank = useRankBank()
  return (
    <main className="rounded-xl px-2 bg-slate-100 grid grid-cols-1 grid-rows-2">
      <header className="flex justify-start items-center mt-5">
        <h3 className="text-3xl font-medium leading-3.75 ">Rank</h3>
      </header>
      <span className="flex justify-center items-center h-full">
        <span className="relative rounded-4xl bg-slate-400/30 w-full h-[3vh]">
          <span
            className="absolute top-0 left-0 h-full bg-blue-800 rounded-4xl transition-all duration-125 ease overflow-hidden"
            style={{ width: `${rank}%` }}
          ></span>
        </span>
      </span>
    </main>
  )
}
