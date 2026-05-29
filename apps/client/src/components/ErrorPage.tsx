import { Skull } from 'lucide-react'

type Props = {
  error?: string
}
export function ErrorPage({ error }: Props) {
  return (
    <div className="w-screen h-screen flex relative justify-center items-center">
      <Skull className="text-red-700 size-50" />
      <div className="flex gap-y-5 flex-col">
        <h1 className="text-5xl font-bold ">Ups! unexpected error</h1>
        <a href="/" className="py-2 px-5 bg-blue-700 text-white rounded-4xl">
          Go back to home
        </a>
      </div>
      <p className="absolute left-5 bottom-5 text-sm">
        {error ?? 'No error message'}
      </p>
    </div>
  )
}
