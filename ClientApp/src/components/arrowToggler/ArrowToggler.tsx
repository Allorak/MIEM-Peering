import { Box, Theme, Tooltip, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { FC } from "react";
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
  return (
    <Box
      sx={styles.wrapper}
      onClick={() => toggleOpenMenu(status)}>
      <Box
        sx={status === true ? { ...styles.togglerButton, ...styles.togglerButtonActive } : styles.togglerButton}
      >
        <Vector
          {...{ svgColor: palette.active.primary }}
        />
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
    '@media (min-width: 768px)': {
      mt: "5px",
      display: 'flex',
      minWidth: '100%',
      height: '54px',
      borderRadius: '4px',
      ":hover": {
        backgroundColor: "#EBECFC",
        cursor: "pointer"
      }
    },
    '@media (min-width: 2048px)': {
      display: 'none',
    }
  } as SxProps<Theme>,

  togglerButton: {
    padding: "15px 15px",
    cursor: "pointer",
    transition: "transform 0.3s ease-out",
    color: "black",
    '@media (min-width: 768px)': {
      display: 'flex'
    },
    '@media (min-width: 2048px)': {
      display: 'none'
    }
  } as SxProps<Theme>,
  togglerButtonActive: {
    transform: 'rotate(180deg)'
  } as SxProps<Theme>,
}