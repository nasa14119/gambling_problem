import { ChangePassword } from '#/components/AdminView/ChangePassword'
import { DeleteUser } from '#/components/AdminView/DeleteUser'
import { RunsMetadata } from '#/components/AdminView/RunsMedatada'
import { UsersView } from '#/components/AdminView/UsersView'
import { NavBar } from '#/components/Nav/NavBar'
import { SERVER_PATH } from '#/env'
import { cn } from '#/lib/utils'
import { Accordion } from '#/shadcn/ui/accordion'
import type { RunsMetadataAdmin } from '@repo/types/db'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin')({
  loader: async () => {
    try {
      const res = await fetch(`${SERVER_PATH}/admin/stats`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        throw redirect({ to: '/user' })
      }

      const data: RunsMetadataAdmin[] = await res.json()
      return data
    } catch (error) {
      if (error instanceof Error && 'to' in error) throw error

      throw redirect({ to: '/user' })
    }
  },
  component: AdminComponent,
})

function AdminComponent() {
  const data = Route.useLoaderData()
  const [state, setState] = useState<'table' | 'user'>('table')
  return (
    <main className="w-screen h-screen grid grid-rows-[auto_auto_auto_1fr]">
      <NavBar />
      <h1 className="text-8xl font-sans tracking-tighter px-10">Admin Panel</h1>
      <div className="px-10 flex gap-x-5">
        <button
          className={cn(
            'border-accent text-accent px-3 rounded-4xl py-1',
            state === 'table' && 'bg-accent text-white',
          )}
          onClick={() => setState('table')}
          disabled={state === 'table'}
        >
          Table
        </button>
        <button
          className={cn(
            'border-accent text-accent px-3 rounded-4xl py-1',
            state === 'user' && 'bg-accent text-white',
          )}
          onClick={() => setState('user')}
          disabled={state === 'user'}
        >
          User
        </button>
      </div>
      {state == 'table' ? <RunsMetadata data={data} /> : <UsersView />}
      <Accordion type="multiple" className="py-2 flex justify-end pr-10 px-10">
        <DeleteUser />
        <ChangePassword />
      </Accordion>
    </main>
  )
}
