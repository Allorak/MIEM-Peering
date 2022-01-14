import type { Theme } from '@mui/material'
import { margin, maxHeight, SxProps } from '@mui/system'


export const table: SxProps<Theme> = {
  borderCollapse: 'separate',
  width: 'auto',
  borderSpacing: "0px 5px"
}

export const cell: SxProps<Theme> = {
  minWidth: '50px',
  border: "none",
  padding: '15px 8px'
}

export const headCell: SxProps<Theme> = {
  ...cell,
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '17px',
  color: '#1E253C',
}

export const expertAvatarWrapper: SxProps<Theme> = {
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  width: "25px",
  height: "25px",
  borderRadius: "50%"
}

export const expertImgWrapper: SxProps<Theme> = {
  overflow: 'hidden',
  flexShrink: 0,
  width: "25px",
  height: "25px",
  borderRadius: "50%"
}

export const headCenteredCell: SxProps<Theme> = {
  ...headCell,
  textAlign: "center",
}

export const headButtonCell: SxProps<Theme> = {
  ...headCell,
  width: "40px",
  textAlign: "center",
}

export const bodyCell: SxProps<Theme> = {
  ...cell,
  backgroundColor: "common.white"
}
export const bodyCellUser: SxProps<Theme> = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  fontWeight: "700"
}

export const bodyGeneralText: SxProps<Theme> = {
  fontWeight: "500",
  fontSize: "13px",
  lineHeight: "24px",
  color: "#0F1B41",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  padding: "0px"
}

export const bodyText: SxProps<Theme> = {
  ...bodyGeneralText,
  WebkitLineClamp: 10,
}

export const bodyShortText: SxProps<Theme> = {
  ...bodyGeneralText,
  WebkitLineClamp: 3,
}

export const bodyCenteredCell: SxProps<Theme> = {
  ...bodyCell,
  textAlign: "center",
}

export const headRow: SxProps<Theme> = {
  "> th:first-child": {
    padding: '15px 8px 15px 18px',
  },
  "> th:last-child": {
    padding: '15px 18px 15px 8px',
  }
}

export const bodyRow: SxProps<Theme> = {
  "> td:first-child": {
    padding: '15px 8px 15px 18px',
    borderRadius: "4px 0px 0px 4px"
  },
  "> td:last-child": {
    padding: '15px 18px 15px 8px',
    borderRadius: "0px 4px 4px 0px"
  }
}