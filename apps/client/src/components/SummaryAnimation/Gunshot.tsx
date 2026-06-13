import styles from './styles.module.css'
import gunsuhut from '#/assets/gunshut.png'
import { cn } from '#/lib/utils'

export function Gunshot() {
  return (
    <img
      src={gunsuhut}
      className={cn('w-full aspect-square object-cover', styles['shot'])}
    />
  )
}
