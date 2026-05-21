import { Table } from '#/components/Table'
import { useTableData } from '#/hooks/useTableData'
import type { ComponentProps } from 'react'

export function TableWithStore({ ...rest }: ComponentProps<'div'>) {
  const table = useTableData()
  return <Table table={table} {...rest} />
}
