import { SERVER_PATH } from '#/env'
import { cn } from '#/lib/utils'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/shadcn/ui/accordion'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export function DeleteUser() {
  const [user, setState] = useState('')
  const { load } = useRouter()
  const [isLoading, setLoading] = useState(false)
  const handleDelete = async () => {
    if (isLoading || !user) return
    setLoading(true)
    try {
      const res = await fetch(SERVER_PATH + '/admin/user', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ username: user }),
      })
      if (res.status !== 204) {
        throw Error('Error given status ' + res.status)
      }
      load()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <AccordionItem
      value="delUser"
      className="w-[20vw] text-white text-left bg-accent rounded-3xl px-5"
    >
      <AccordionTrigger className="text-xl">Delete User</AccordionTrigger>
      <AccordionContent>
        <form
          className="h-fit flex flex-col py-2 gap-y-5 text-xl"
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
        >
          <input
            type="text"
            className="px-2 py-2 focus:outline-0"
            placeholder="username"
            value={user}
            onChange={(e) => setState(e.target.value)}
          />
          <button
            className={cn(
              'bg-red-100 text-red-700 py-2 rounded-4xl',
              isLoading && 'opacity-50',
            )}
            disabled={isLoading}
          >
            DELETE
          </button>
        </form>
      </AccordionContent>
    </AccordionItem>
  )
}
