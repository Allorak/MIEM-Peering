import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { FC } from "react";

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
      sx={status === true ? {...styles.togglerButton, ...styles.togglerButtonActive} : styles.togglerButton}
      onClick={() => toggleOpenMenu(status)}>
      <Vector />
    </Box>
  )
}

const styles = {
  togglerButton: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    ml: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: "pointer",
    '@media (min-width: 768px)': {
      display: 'flex'
    },
    '@media (min-width: 2048px)': {
      display: 'none'
    },
    ":hover": {
      backgroundColor: '#EBECFC',
    }
  } as SxProps<Theme>,
  togglerButtonActive: {
    transform: 'rotate(180deg)'
  } as SxProps<Theme>,
}