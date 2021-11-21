import { FC, useMemo } from "react"
import { TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"
import type { SxProps } from "@mui/system"

import * as styles from "./styles"


interface IProps extends TableCellProps {
  isCentered?: boolean,
}

export const TableHeadCell: FC<IProps> = ({
  children,
  sx,
  isCentered,
  ...props
}) => {

  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    const cellStyle = isCentered ? styles.headCenteredCell : styles.headCell
    return {
      ...cellStyle,
      ...sx,
    }
  }, [sx])

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