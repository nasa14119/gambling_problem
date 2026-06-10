import { ChangePasswordForm } from '#/components/AdminView/ChangePasswordForm'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/shadcn/ui/accordion'

export function ChangePassword() {
  return (
    <AccordionItem
      value="passchange"
      className="w-[20vw] bg-accent rounded-3xl text-white px-5"
    >
      <AccordionTrigger className="text-xl">Change password</AccordionTrigger>
      <AccordionContent>
        <ChangePasswordForm />
      </AccordionContent>
    </AccordionItem>
  )
}
