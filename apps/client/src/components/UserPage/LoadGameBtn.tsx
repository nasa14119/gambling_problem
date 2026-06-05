import { fetchLoadGame } from '#/lib/fetch'
import { cn } from '#/lib/utils'
import { Spinner } from '#/shadcn/ui/spinner'
import { useRouter } from '@tanstack/react-router'
import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

export function LoadGameBtn() {
  const { navigate } = useRouter()
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [error, setError] = useState(false)
  const handleRestoreGame = async () => {
    setDisable(true)
    const timer = setTimeout(() => setLoading(true), 200)
    try {
      await fetchLoadGame()
      setError(false)
      navigate({ to: '/game' })
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      clearTimeout(timer)
      setLoading(false)
      setDisable(false)
    }
  }
  return (
    <button
      className={cn(
        'bg-slate-300 aspect-12/9 border border-slate-800 grid place-content-center',
        error && 'text-red-700',
      )}
      onClick={handleRestoreGame}
      disabled={disable}
    >
      {error && <X className="size-5" />}
      {!loading && !error && <ArrowRight className="size-5" />}
      {loading && !error && <Spinner className="size-5 opacity-50" />}
    </button>
  )
}
