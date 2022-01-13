import { SxProps, Theme } from "@mui/system";
import { palette } from "../theme/colors";

export const container: SxProps<Theme> = {
  maxWidth: '1400px',
  margin: '0px auto',
  padding: '0px 15px'
}

export const formItemContainer: SxProps<Theme> = {
  margin: '0px 0px 10px 0px'
}

export const submitBtContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end'
}

export const submitBtContainerCenter: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center'
}

export const scrollStyles = {
  ":hover": {
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: palette.fillLight.greyLight
    }
  },
  "&::-webkit-scrollbar": {
    width: "5px",
    height: "5px"
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: palette.transparent.default,
    borderRadius: "10px"
  }
}