import { cn } from '@/lib/utils'
import { LoaderIcon } from 'lucide-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin animation-duration-[3s]', className)}
      {...props}
    />
  )
}

export { Spinner }
