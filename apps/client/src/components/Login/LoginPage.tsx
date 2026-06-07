import { cn } from '#/lib/utils'
import { Power, User2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { LoginForm } from '#/components/Login/LoginForm'
import { NavBar } from '#/components/Nav/NavBar'

export function LoginMain() {
  return (
    <header className={cn('w-screen h-screen relative z-0 ')}>
      <NavBar className="absolute inset-x-0" />
      <div className={cn('size-full flex flex-col gap-y-5 justify-center')}>
        <div className="grid place-content-center">
          <User2 className="size-[25vh] text-current p-5 bg-current/20 rounded-full" />
        </div>
        <div className="absolute bottom-2 inset-x-0 fade-in animate-in slide-in-from-bottom">
          <h1 className="text-center text-6xl font-bold">Gambling Problem</h1>
        </div>
        <LoginForm />
        <div className="flex justify-center mt-8">
          <small className="text-[#2f1000]">
            If the account does not exits, will be created automatically
          </small>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 inset-x-0 flex justify-end pb-2 px-5">
        <div className="flex gap-x-2 items-center">
          <Link to="/">
            <Power
              className={cn(
                'size-12 text-black opacity-10 transition-all duration-250 ease hover:opacity-100',
              )}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
