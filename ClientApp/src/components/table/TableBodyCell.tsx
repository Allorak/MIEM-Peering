import { FC, useMemo } from "react"
import { TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"
import type { SxProps } from "@mui/system"


import * as styles from "./styles"

type IProps = TableCellProps & {
  isCentered?: boolean,
}

export const TableBodyCell: FC<IProps> = ({
  children,
  isCentered,
  sx,
  ...props
}) => {
  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    const cellStyle = isCentered ? styles.centeredCell : styles.cell
    return {
      ...cellStyle,
      ...sx
    }
  }, [sx, isCentered])

  return (
    <MuiTableCell
      variant={"body"}
      sx={mergedSx}
      {...props}
    >
      {children}
    </MuiTableCell>
  )
}