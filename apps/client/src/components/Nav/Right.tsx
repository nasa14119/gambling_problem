import { NavItem } from '#/components/Nav/NavItem'

export function Right() {
  return (
    <div className="flex justify-end items-end">
      <NavItem
        type="fill"
        className="px-2 font-semibold tracking-wide text-2xl"
        to="/about"
        text="About"
      />
    </div>
  )
}
