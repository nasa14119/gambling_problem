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
export const useAuth = () => useAuthStore((s) => s.auth)
