
import { FC, useCallback, useMemo } from "react";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { palette } from "../../theme/colors";

import { Vector } from "../icons/Vector";


type IProps = {
  status: boolean,
  toggleOpenMenu: (status: boolean) => void
}

export const ArrowToggler: FC<IProps> = ({
  status,
  toggleOpenMenu
}) => {

  const handleTooglerClick = useCallback(() => {
    toggleOpenMenu(status)
  }, [toggleOpenMenu, status])

  const togglerBtSx = useMemo(() => {
    return status ? {
      ...styles.togglerButton,
      ...styles.togglerButtonActive
    } : styles.togglerButton
  }, [status])

  return (
    <Box
      sx={styles.wrapper}
      onClick={handleTooglerClick}
    >
      <Box sx={togglerBtSx}>
        <Vector svgColor={palette.active.primary} />
      </Box>

      {status && (
        <Typography
          lineHeight={"54px"}
          height={"100%"}
          variant={"h6"}
          fontWeight={700}
          color={"primary.main"}
          pl={"5px"}
        >
          {"Скрыть"}
        </Typography>
      )}
    </Box>
  )
}

const styles = {
  wrapper: {
    mt: "5px",
    display: 'flex',
    minWidth: '100%',
    height: '54px',
    borderRadius: '4px',
    ":hover": {
      backgroundColor: "#EBECFC",
      cursor: "pointer"
    },
    '@media (min-width: 2048px)': {
      display: 'none',
    }
  } as SxProps<Theme>,

  togglerButton: {
    cursor: "pointer",
    transition: "transform 0.3s ease-out",
    color: "black",
    padding: "13px",
    '@media (min-width: 768px)': {
      display: 'flex',
      padding: "15px",
    },
    '@media (min-width: 2048px)': {
      display: 'none'
    }
  } as SxProps<Theme>,
  togglerButtonActive: {
    transform: 'rotate(180deg)'
  } as SxProps<Theme>,
}