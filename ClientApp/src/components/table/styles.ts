import type { Theme } from '@mui/material'
import type { SxProps } from '@mui/system'


export const table: SxProps<Theme> = {
  borderCollapse: 'collapse',
}

export const cell: SxProps<Theme> = {
  minWidth: '50px',
  borderRadius: '6px',
  border: 'none',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '32px',
  textAlign: 'left',
  color: '#17151C',
  backgroundColor: 'secondary.light',
}

export const headCell: SxProps<Theme> = {
  ...cell,
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '24px',
  color: 'common.white',
  textAlign: 'center',
  backgroundColor: 'rgba(122, 117, 133, 0.52)',
}

export const headButtonCell: SxProps<Theme> = {
  ...headCell,
  width: "50px",
}

export const centeredCell: SxProps<Theme> = {
  ...cell,
  textAlign: "center",
}