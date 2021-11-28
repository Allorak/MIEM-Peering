import { FC, useMemo } from 'react'
import { Table as MuiTable, Theme, TableProps } from '@mui/material'
import type { SxProps } from '@mui/system'

import * as styles from './styles'

type IProps = TableProps

export const Table: FC<IProps> = ({
  children,
  sx,
  ...props
}) => {

  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => ({
    ...styles.table,
    ...sx
  }), [sx])

  return (
    <MuiTable
      sx={mergedSx}
      {...props}
    >
      {children}
    </MuiTable>
  )
}

// https://codepen.io/team/css-tricks/pen/wXgJww?editors=1100 адаптивная таблица