import { FC, useMemo } from "react"
import { Box, TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"

import DefaultAvatar from '../../img/ico/avatar.svg'
import type { SxProps } from "@mui/system"


import * as styles from "./styles"

type IProps = TableCellProps & {
  isCentered?: boolean,
  name: string,
  img?: string
}

export const TableBodyCellUser: FC<IProps> = ({
  children,
  isCentered,
  img,
  name,
  sx,
  ...props
}) => {
  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    const cellStyle = isCentered ? styles.bodyCenteredCell : styles.bodyCell
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
      <Box sx={styles.bodyCellUser}>
        <img src={img ?? DefaultAvatar} height={"24px"} width={"24px"} alt={""} />
        {name}
        {children}
      </Box>
    </MuiTableCell>
  )
}