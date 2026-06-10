import { useAuth } from '#/components/Login/store'
import { Section } from '#/Landing/Section'
import { Link } from '@tanstack/react-router'
import { ChevronsRight } from 'lucide-react'

export function Tutorial() {
  const { isLogged } = useAuth()
  const gameLink = isLogged ? '/user' : '/login'
  return (
    <div className="grid grid-cols-2">
      <Section title="tutorial" side="center">
        <div className="col-span-12 flex justify-center items-center py-2">
          <Link
            to="/tutorial"
            className="flex gap-x-5 justify-center items-center px-20 border border-accent rounded-4xl py-2 text-accent hover:bg-accent hover:text-white transition-colors duration-250 ease"
          >
            <span className="text-xl capitalize font-sans font-semibold">
              Go to tutorial
            </span>
            <ChevronsRight className="size-7" />
          </Link>
        </div>
      </Section>
      <Section title="start" side="center">
        <div className="col-span-12 flex justify-center items-center py-2">
          <Link
            to={gameLink}
            className="flex gap-x-5 justify-center items-center px-20 border border-accent rounded-4xl py-2 text-accent hover:bg-accent hover:text-white transition-colors duration-250 ease"
          >
            <span className="text-xl capitalize font-sans font-semibold">
              Jump to game
            </span>
            <ChevronsRight className="size-7" />
          </Link>
        </div>
      </Section>
    </div>
  )
}
