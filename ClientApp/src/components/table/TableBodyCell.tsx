import { FC, useMemo } from "react"
import { Box, TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"
import type { SxProps } from "@mui/system"


import * as styles from "./styles"

type IProps = TableCellProps & {
  isCentered?: boolean,
  isRight?: boolean,
  text?: boolean
}

export const TableBodyCell: FC<IProps> = ({
  children,
  isCentered,
  isRight,
  sx,
  text,
  ...props
}) => {
  const mergedSx = useMemo<SxProps<Theme> | undefined>(() => {
    const cellStyle = isCentered ? styles.bodyCenteredCell : isRight ? styles.bodyRightCell : styles.bodyCell
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
      {text && text === true ?
        (
          <Box sx={styles.bodyText}>
            {children}
          </Box>
        ) :
        (<Box sx={styles.bodyShortText}>
          {children}
        </Box>
        )
      }
    </MuiTableCell>
  )
}