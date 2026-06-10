export function Footer() {
  return (
    <footer className="pt-20 text-accent">
      <div className="pl-[5%]">
        <h1 className="font-circle uppercase text-8xl text-black">Credits</h1>
      </div>
      <span className="flex justify-start items-center text-4xl uppercase px-[5%] pt-10">
        Develop by:
      </span>
      <div className="grid grid-cols-2 text-7xl *:flex *:flex-col *:items-center py-10">
        <span>
          <span>Nicolas Amaya</span>
          <span>Sarmiento</span>
        </span>
        <span>
          <span>Pablo Paz</span>
          <span>Davila</span>
        </span>
      </div>
      <span className="flex justify-start items-center text-xl px-[5%]  capitalize py-2 font-thin">
        For: Software Construction and Decision Making (Gpo 501)
      </span>
    </footer>
  )
}
