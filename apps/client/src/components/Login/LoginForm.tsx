import { cn } from '#/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { zodValidateInput } from '@repo/validator/user-validator'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { UserCreationInput } from '@repo/validator/user-validator'
import type { SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { SERVER_PATH } from '#/env'
import { useRouter } from '@tanstack/react-router'
import { useAuth, useAuthSetter } from '#/components/Login/store'

export function LoginForm() {
  const { isLogged, playerId } = useAuth()
  const setAuth = useAuthSetter()
  const {
    register,
    setError,
    setFocus,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<UserCreationInput>({
    resolver: zodResolver(zodValidateInput),
    mode: 'all',
    defaultValues: {
      user: playerId ?? undefined,
    },
  })
  const { navigate } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit: SubmitHandler<UserCreationInput> = async (inp) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${SERVER_PATH}/api/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(inp),
        method: 'POST',
      })
      const data = await res.json()
      if (res.status === 400 || res.status === 500) {
        setError('user', { message: data.user })
        setError('password', { message: data.password })
        setFocus(data.user ? 'user' : 'password')
        return
      }
      if (!res.ok) {
        throw new Error('Unexpected error')
      }
      setAuth({ playerId: data.playerId, isLogged: true })
      navigate({ to: '/user' })
    } finally {
      setIsLoading(false)
    }
  }
  const [visible, setVisible] = useState(false)
  if (isLogged) {
    navigate({ to: '/user' })
    return
  }
  return (
    <form
      className="h-[5vh] w-[20vw] min-w-60 flex flex-col mx-auto gap-y-2 *:animate-in *:slide-in-from-right-2 *:duration-500 *:animate-ease-in-out"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <label htmlFor="user">
            <input
              className={cn(
                'text-sm pl-2 py-1 border-2 border-black flex items-center size-full bg-slate-100 focus:border-slate-500 focus:border-2 focus:outline-none min-w-60',
                errors.user && 'border-red-500',
                isLoading && 'opacity-50',
              )}
              id="user"
              placeholder="username"
              disabled={isLoading}
              autoComplete="username"
              {...register('user')}
            />
          </label>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className={cn('text-red-200', !errors.user && 'hidden')}
        >
          <span className="text-red-600">{errors.user?.message}</span>
        </TooltipContent>
      </Tooltip>
      <div className="grid grid-cols-[1fr_min-content]">
        <Tooltip>
          <TooltipTrigger asChild>
            <label htmlFor="password" className="relative">
              <input
                id="password"
                className={cn(
                  'min-w-60 text-sm py-1 pl-2 border-2 border-black focus:border-slate-500 flex items-center size-full bg-slate-100 focus:outline-none',
                  errors.password && 'border-red-500',
                  isLoading && 'opacity-50',
                )}
                type={visible ? 'text' : 'password'}
                autoComplete="password"
                placeholder="password"
                disabled={isLoading}
                {...register('password')}
              />
              <span
                className="absolute right-2 inset-y-0 flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setVisible((prev) => !prev)
                }}
              >
                {visible ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </span>
            </label>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className={cn('text-red-200', !errors.password && 'hidden')}
          >
            <span className="text-red-600">{errors.password?.message}</span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                'bg-slate-300 aspect-12/9 border-2 border-l-0 border-slate-800 grid place-content-center',
                !isValid && 'opacity-50',
              )}
              type="submit"
              disabled={!isValid}
            >
              <ArrowRight className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-current">
            <span className="text-white">Login</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  )
}
