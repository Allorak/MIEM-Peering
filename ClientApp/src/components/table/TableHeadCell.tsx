import { FC, useMemo } from "react"
import { TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"
import type { SxProps } from "@mui/system"

import * as styles from "./styles"


type IProps = TableCellProps & {
  isButtonCell?: boolean,
}

export const TableHeadCell: FC<IProps> = ({
  children,
  isButtonCell,
  sx,
  ...props
}) => {

  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    const cellStyle = isButtonCell ? styles.headButtonCell : styles.headCell
    return {
      ...cellStyle,
      ...sx,
    }
  }, [sx, isButtonCell])

  return (
    <MuiTableCell
      variant={"head"}
      sx={mergedSx}
      {...props}
    >
      {children}
    </MuiTableCell>
  )
}