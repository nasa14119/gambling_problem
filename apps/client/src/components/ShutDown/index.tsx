import style from './styles.module.css'

export function Shutdown() {
  return (
    <div className="fixed inset-0 flex justify-center items-center -z-10">
      <span className={style['ball']} />
    </div>
  )
}
