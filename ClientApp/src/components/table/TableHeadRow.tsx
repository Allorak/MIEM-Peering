import { FC, useMemo } from "react"
import { TableRow as MuiTableRow, Theme, TableRowProps } from "@mui/material"
import type { SxProps } from "@mui/system"


import * as styles from "./styles"

interface IProps extends TableRowProps {
}

export const TableHeadRow: FC<IProps> = ({
  children,
  sx,
  ...props
}) => {
  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    return {
      ...styles.headRow,
      ...sx
    }
  }, [sx])

  return (
    <MuiTableRow
      sx={mergedSx}
      {...props}
    >
      {children}
    </MuiTableRow>
  )
}