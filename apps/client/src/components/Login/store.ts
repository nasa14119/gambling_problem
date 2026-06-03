import { SERVER_PATH } from '#/env'
import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Auth = {
  auth: {
    playerId: null | string
    isLogged: boolean
  }
  setState: (state: Partial<Auth['auth']>) => void
}
export const useAuthStore = create<Auth>()(
  persist(
    (set) => ({
      auth: {
        playerId: null,
        isLogged: false,
      },
      setState: (state) => set((p) => ({ auth: { ...p.auth, ...state } })),
    }),
    { name: 'auth' },
  ),
)

export const useAuthSetter = () => useAuthStore((s) => s.setState)
export const useAuth = () => {
  return useAuthStore((s) => s.auth)
}
export const useAuthValidate = () => {
  const setState = useAuthStore((s) => s.setState)
  useEffect(() => {
    const fetchValidation = async () => {
      const res = await fetch(SERVER_PATH + '/api/validate', {
        credentials: 'include',
      })
      setState({ isLogged: res.status === 204 })
    }
    fetchValidation()
  }, [])
}
