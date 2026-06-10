import { Section } from '#/Landing/Section'
import diagram from '#/assets/architecture.svg'
import { cn } from '#/lib/utils'
import styles from './landing.module.css'

export function Architecture() {
  return (
    <Section title="architecture" side="left">
      <div
        className={cn(
          'col-span-6 flex justify-center items-start flex-col',
          styles['p-styles'],
        )}
      >
        <p>
          The game was architected to be a server-side event-driven
          architecture. This ensures the game can't be tampered with. Also
          allows for endless possibilities, but the most important is to have
          multiplayer.
        </p>
        <p>
          We have a session system that stores the game instances and is a
          WebSocket server; this allows for real-time communication. This is
          also in charge of saving the sessions in the database and restoring
          them on demand. The client connects here, and a facade to the game is
          created. That is important because it validates user input with zod
          for any malicious intentions.
        </p>
        <p>
          Exploits are layers of the game with their events and communication.
          They were designed so that the complete game can be modified for later
          extension of more exploits, ranks, money, etc.
        </p>
        <p>
          The mafia could add extra modifiers as backbetting, and it was planned
          as a system to limit the exploit usage that is a current work in
          progress.
        </p>
        <p>
          For authentication, we are using standards of security. Using the
          encryption algorithm recommended by OSWAP (Argon2). This with
          conjunction of HTTP Only cookies trasporting a encripted Json Web
          Tocken that dificults the acount spoffing.
        </p>
      </div>
      <div className="col-span-6 flex justify-center items-center ">
        <img src={diagram} />
      </div>
    </Section>
  )
}
