import type { Theme } from '@mui/material'
import { margin, SxProps } from '@mui/system'


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

export const headCenteredCell: SxProps<Theme> = {
  ...headCell,
  textAlign: "center",
}

export const bodyCell: SxProps<Theme> = {
  ...cell,
  fontWeight: "500",
  fontSize: "13px",
  lineHeight: "24px",
  color: "#0F1B41",
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: "nowrap",
  maxHeight: '72px',
  backgroundColor: "common.white"
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