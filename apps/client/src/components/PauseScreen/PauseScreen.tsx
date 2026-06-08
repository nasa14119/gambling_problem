import { NavBar } from '#/components/Nav/NavBar'
import { usePauseState, useResume } from '#/components/PauseScreen/store'
import { fetchSaveQuit } from '#/lib/fetch'
import { Link } from '@tanstack/react-router'

export function PauseScreen() {
  const isPaused = usePauseState()
  const resume = useResume()
  if (!isPaused) return null
  return (
    <div className="fixed inset-0 grid place-content-center z-100">
      <NavBar className="absolute top-0 inset-x-0 z-100 bg-transparent" />
      <div className="w-[50vw]  bg-slate-950 rounded-sm flex justify-center relative z-100 py-[10%] flex-col gap-y-10 items-center">
        <div
          className="w-4/5 h-20 bg-slate-200 text-slate-950 rounded-md text-5xl font-bold flex items-center justify-center transition-all duration-200 ease hover:scale-101 hover:bg-slate-100 uppercase"
          onClick={resume}
        >
          Resume
        </div>
        <div
          className="w-4/5 h-20 bg-slate-400 text-slate-950 rounded-md text-5xl font-bold flex items-center pl-10 transition-all duration-200 ease hover:scale-101 hover:bg-slate-300"
          onClick={() => {
            localStorage.removeItem('gameState')
            fetchSaveQuit()
            resume()
          }}
        >
          Save and quit
        </div>
        <Link
          className="w-4/5 h-20 bg-slate-400 text-slate-950 rounded-md text-5xl font-bold flex items-center pl-10 transition-all duration-200 ease hover:scale-101 hover:bg-slate-300"
          to="/user"
        >
          Go to user page
        </Link>
      </div>
      <div className="z-90 backdrop-blur-[5px] absolute inset-0" />
    </div>
  )
}
