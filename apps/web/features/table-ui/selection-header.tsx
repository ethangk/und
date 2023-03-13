import { Box, Checkbox } from '@egodb/ui'
import type { Table } from '@tanstack/react-table'
import React from 'react'
import { SELECTION_ID } from '../../constants/field.constants'
import type { TData } from './interface'
import { usePinnedStyles } from './styles'

export const SelectionHeader: React.FC<{ table: Table<TData> }> = ({ table }) => {
  const { classes, cx } = usePinnedStyles({})

  return (
    <Box component="td" className={cx([classes.cell, classes.sticky])} w="40px">
      <th key={SELECTION_ID}>
        <Checkbox
          size="xs"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          indeterminate={table.getIsSomeRowsSelected()}
        />
      </th>
    </Box>
  )
}