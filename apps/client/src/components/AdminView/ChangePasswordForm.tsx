import { SERVER_PATH } from '#/env'
import { cn } from '#/lib/utils'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

type Form = {
  username: string
  password: string
}
export function ChangePasswordForm() {
  const { register, handleSubmit, reset } = useForm<Form>()
  const [isLoading, setLoading] = useState(false)
  const onSubmit: SubmitHandler<Form> = async (vals) => {
    setLoading(true)
    try {
      const res = await fetch(SERVER_PATH + '/admin/change-pass', {
        credentials: 'include',
        body: JSON.stringify(vals),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.status !== 204) {
        throw Error('Error given status ' + res.status)
      }
      reset()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form
      className="flex flex-col h-fit py-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        placeholder="user"
        className="px-2 py-2 focus:outline-0"
        {...register('username', { required: true })}
      />
      <input
        placeholder="password"
        className="px-2 py-2 focus:outline-0"
        {...register('password', { required: true })}
      />
      <button
        className={cn(
          'bg-white text-accent py-2 rounded-4xl',
          isLoading && 'opacity-50',
        )}
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  )
}
