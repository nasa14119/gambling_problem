import { Architecture } from '#/Landing/Architecture'
import { Description } from '#/Landing/Description'
import { Footer } from '#/Landing/Footer'
import { Tutorial } from '#/Landing/Tutorial'
import { HeroLanding } from './HeroLanding'

export function Landing() {
  return (
    <>
      <HeroLanding />
      <Description />
      <Architecture />
      <Tutorial />
      <Footer />
    </>
  )
}
