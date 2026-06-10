import { Section } from '#/Landing/Section'
import styles from './landing.module.css'

export function Description() {
  return (
    <Section title="Description" className={styles['p-styles']} side="center">
      <div className="col-span-12 flex justify-start items-center flex-col *:text-center py-[6vh]">
        <p>
          Gambling problem is a TCG, roguelike, strategy game. This is that the
          game is unique every time you start a new round. The objective is for
          you to do a strategy between exploit use, paying your debts on time,
          and leveling up to unlock new exploits.
        </p>
        <p>
          Your rank is given by the money you are gaining; as you progress,
          expect other players to start to become better as you get to exclusive
          tables.
        </p>
        <p>
          The problem is that you have to pay your bills with the mafia that let
          you use their tool to play. Their interest rises as levels pass; if
          you don't pay in time, they will try to kill you.
        </p>
      </div>
    </Section>
  )
}
