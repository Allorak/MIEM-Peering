import { FC, useMemo } from "react"
import { Box, TableCell as MuiTableCell, Theme, TableCellProps } from "@mui/material"
import type { SxProps } from "@mui/system"


import * as styles from "./styles"
import { Avatar as AvatarIcon } from "../icons/Avatar"

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
        {img ? (
          <Box sx={{ ...styles.expertImgWrapper }}>
            <img
              src={img}
              style={{width: 25, height: 'auto'}}
              alt="Avatar" />
          </Box>
        ) : (
          <Box sx={{ ...styles.expertAvatarWrapper }}>
            <AvatarIcon />
          </Box>
        )
        }
        {name}

        {children}
      </Box>
    </MuiTableCell>
  )
}