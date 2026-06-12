import { Pill } from '#/components/Bank/Pill'
import { cn } from '#/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

export type SubmitFunction = (key: 'money' | 'chips', value: number) => void
type Props = {
  title: string
  type: 'money' | 'chips'
  onChange: SubmitFunction
  maxValue: number
} & Omit<ComponentProps<'div'>, 'onChange'>
const FormSchema = (max: number) =>
  z.object({
    value: z
      .number()
      .positive()
      .min(1)
      .max(max)
      .transform((v) => Math.floor(v)),
  })
type FormData = z.infer<ReturnType<typeof FormSchema>>
export function Convertion({
  title,
  type,
  children,
  className,
  maxValue,
  onChange,
  ...rest
}: Props) {
  const schema = FormSchema(maxValue)
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<FormData> = ({ value }) => {
    onChange(type, value)
    reset()
  }
  const errorInput = errors['value']
  return (
    <div
      className={cn(
        'border-2 border-current border-dashed rounded-sm flex flex-col px-5 py-4 text-xl',
        className,
      )}
      {...rest}
    >
      <h3 className="font-medium">{title}</h3>
      <form
        className="flex items-center gap-x-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Pill
          type={type}
          {...register('value', {
            valueAsNumber: true,
            onChange: (e) => {
              e.target.value = e.target.value.replace(/[^\d]/g, '')
              setValue('value', e.target.value)
            },
            onBlur: (e) => {
              if (e.target.value === '') clearErrors()
            },
          })}
          error={!!errorInput}
        />
        <Arrow />
        <Pill
          type={type === 'money' ? 'chips' : 'money'}
          disabled
          value={watch('value')}
        />
        <button
          className={cn(
            'ml-auto text-white border-2 border-current border-dashed font-black rounded-sm px-4 py-2 text-lg h-4/5 grid place-content-center',
            errorInput && 'opacity-50',
          )}
          disabled={!!errorInput}
        >
          {type === 'money' ? 'Transfer' : 'Convert'}
        </button>
      </form>
    </div>
  )
}

function Arrow() {
  return (
    <span className="bg-current/10 rounded-full p-1">
      <ArrowRight className="size-5" />
    </span>
  )
}
