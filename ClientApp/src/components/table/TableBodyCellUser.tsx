import { FC, useMemo } from "react"
import { Box, TableCell as MuiTableCell, Theme, TableCellProps, Typography, Tooltip } from "@mui/material"
import type { SxProps } from "@mui/system"
import Zoom from '@mui/material/Zoom';


import * as styles from "./styles"
import { Avatar as AvatarIcon } from "../icons/Avatar"

type IProps = TableCellProps & {
  isCentered?: boolean,
  name: string,
  img?: string,
  email: string,
  joinedByLti?: boolean,
  receivedLtiGrade?: boolean
}

export const TableBodyCellUser: FC<IProps> = ({
  children,
  isCentered,
  img,
  name,
  email,
  sx,
  joinedByLti,
  receivedLtiGrade,
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
              style={{ width: 35, height: 'auto' }}
              alt="Avatar" />
          </Box>
        ) : (
          <Box sx={{ ...styles.expertAvatarWrapper }}>
            <AvatarIcon />
          </Box>
        )}

        <Box lineHeight={1}>
          {name}

          {joinedByLti === true && (
            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {receivedLtiGrade === true ?

                    "Итоговая оценка возвращена в систему LMS." :
                    "Итоговая оценка НЕ возвращена в систему LMS."
                  }
                </span>
              }
              placeholder={"top"}
              arrow
              enterDelay={0}
              leaveDelay={0}
              TransitionComponent={Zoom}
            >
              <Typography
                display={"inline-block"}
                ml={"4px"}
                variant={"body2"}
                padding={"4px"}
                lineHeight={1}
                bgcolor={receivedLtiGrade === true ? "primary.main" : "secondary.main"}
                color={"common.white"}
                borderRadius={"5px"}
                fontWeight={700}
              >
                {"LTI"}
              </Typography>
            </Tooltip>
          )}


          <a href={`mailto: ${email}`}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: "underline",
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "primary.main"
                }
              }}
            >
              {email}
            </Typography>

          </a>
        </Box>

        {children}
      </Box >
    </MuiTableCell >
  )
}