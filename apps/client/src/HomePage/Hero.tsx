import { ArrowRight, Power, User2 } from 'lucide-react'

export function Hero() {
  return (
    <header className="w-screen h-screen flex flex-col gap-y-5 justify-center bg-blue-950/20 relative">
      <div className="grid place-content-center">
        <User2 className="size-[25vh] text-blue-700 p-5 bg-slate-300 rounded-full" />
      </div>
      <div>
        <h1 className="text-center text-6xl font-bold">Gambling Problem</h1>
      </div>
      <div className="h-[5vh] w-[20vw] grid grid-cols-[1fr_min-content] mx-auto ">
        <p className="text-xl pl-2 border border-slate-800 border-r-0 flex items-center size-full bg-slate-100">
          5tart_new_game#$
        </p>
        <a
          className="bg-slate-300 aspect-12/9 border border-slate-800 grid place-content-center"
          href="/game"
        >
          <ArrowRight className="size-5" />
        </a>
      </div>
      <div className="absolute bottom-0 left-0 inset-x-0 flex justify-between p-5">
        <div></div>
        <div className="flex gap-x-2 items-center">
          <Power className="opacity-10 size-8" />
        </div>
      </div>
    </header>
  )
}
