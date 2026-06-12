import { NavBar } from '#/components/Nav/NavBar'
import { Skull } from 'lucide-react'

export function HeroLanding() {
  return (
    <main className="grid w-screen h-screen grid-cols-1 grid-rows-[auto_1fr] font-sans max-w-[100vw] overflow-hidden relative">
      <NavBar className="sticky top-0 font-base" />
      <div className="size-full grid grid-cols-2 gap-x-2">
        <aside className="flex items-center justify-end animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="pb-[10vh]">
            <h1 className="font-bold text-[18vh] lg:text-[140px] leading-30 flex flex-col">
              <span>Gambling</span>
              <span>Problem</span>
            </h1>
            <h2 className="text-[4vh] font-medium pl-10 text-accent">
              A life of gambling
            </h2>
          </div>
        </aside>
        <section className="flex justify-center items-center relative flex-col [&>p]:w-[40ch] [&>p]:pb-5 text-lg">
          <p className="pt-[15vh]">
            For some reason, you get involved with a big mafia. These guys are
            kind enough to lend you some money so you can live the dream, become
            a millionaire playing poker.
          </p>
          <p>
            They also allow you to use their tool, poker face and use cheats to
            up your chances. Remember, the mafia always is dangerous; they might
            kill you if you make them mad.
          </p>
          <Skull className="size-[80vh] aspect-square max-h-256 absolute bottom-0 -right-20 opacity-10 text-red-900" />
        </section>
      </div>
      <small className="absolute left-[5vh] bottom-[5vh] font-pixelated text-lg">
        (alpha)
      </small>
    </main>
  )
}
