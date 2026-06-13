import { Section } from '#/Landing/Section'
import styles from './landing.module.css'

export function Description() {
  return (
    <Section title="Description" className={styles['p-styles']} side="center">
      <div className="col-span-12 flex justify-start items-center flex-col *:text-center py-[6vh]">
        <p>
          Gambling problem is a TCG, roguelike, strategy game. By this at the
          begining your run is unique from the last. The objective is for you to
          do a strategize between exploit use, paying your debts on time, and
          leveling up to unlock new exploits.
        </p>
        <p>
          Your rank is given by the money you are gaining. As you progress,
          expect other players to start to become better as you get to exclusive
          tables.
        </p>
        <p>
          Remember to pay your contribution with the mafia. Afeter all they gave
          you a unique oportunity. It is common that in the word of gangs
          someone get's kill...
        </p>
      </div>
    </Section>
  )
}
