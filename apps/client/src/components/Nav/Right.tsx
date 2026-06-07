import { LandingNav } from '#/components/Nav/LandingNav'
import { Login } from '#/components/Nav/LoginNav'

export function Right() {
  return (
    <div className="flex justify-end items-center gap-x-5 ">
      <Login />
      <LandingNav />
    </div>
  )
}
