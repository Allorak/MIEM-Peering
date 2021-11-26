import { FC } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";

import { palette } from "../../theme/colors";


interface IProps {
  progress: number
}

export const Progress: FC<IProps> = ({ progress }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant={"determinate"}
        value={progress} size={45}
        sx={styles.progress}
      />

      <Box sx={styles.progressWrapper}>
        <Typography sx={styles.text} component="div" color="text.secondary">
          {`${Math.round(progress)}`}
          <Typography sx={{ ...styles.text, fontSize: "10px" }} component={"span"}>
            {"%"}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

const styles = {
  progress: {
    color: palette.active.primary
  } as SxProps<Theme>,
  progressWrapper: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,
  text: {
    color: palette.active.primary,
    fontSize: "14px",
    textTransform: "uppercase",
    fontWeight: 500,
    lineHeight: "12px"
  } as SxProps<Theme>,
}