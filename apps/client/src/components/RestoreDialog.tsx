import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/shadcn/ui/alert-dialog'
import type { PropsWithChildren } from 'react'

type Props = {
  onAccept: () => void
} & PropsWithChildren
export function RestoreDialog({ children, onAccept }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you continue with this you will not be able to play this run
            again
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="h-full flex items-end gap-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>
            Accept and reset run
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
