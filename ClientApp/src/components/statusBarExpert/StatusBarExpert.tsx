import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { LinearProgress, Typography } from "@mui/material";

import { palette } from "../../theme/colors"


interface IProps {
  checkedWorksCount?: number,
  assignedWorksCount?: number
}

export const StatusBarExpert: FC<IProps> = ({
  checkedWorksCount,
  assignedWorksCount
}) => {

  if (typeof checkedWorksCount !== 'number' && typeof assignedWorksCount !== 'number') {
    return (
      <Box>
        <Box sx={styles.wrapper}>
          <Typography variant={'h6'}>
            {"Статистика:"}
          </Typography>

          <Box sx={styles.progressContainer}>
            <Typography
              variant={'h6'}
              sx={{ ...styles.progressText, color: palette.fill.grey }}
            >
              {"Нет данных"}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  const assignedPercentage = (typeof checkedWorksCount === 'number' ? checkedWorksCount : 0) * 100 / (typeof assignedWorksCount === 'number' ? assignedWorksCount : 1)

  return (
    <Box>
      <Box sx={styles.wrapper}>
        <Typography variant={'h6'}>
          {"Статистика:"}
        </Typography>

        <Box sx={styles.progressContainer}>
          <Typography
            variant={"h6"}
            sx={styles.progressText}
          >
            {`${assignedWorksCount} из ${checkedWorksCount}`}
          </Typography>

          <LinearProgress
            value={assignedPercentage}
            variant={"determinate"}
            sx={styles.linearProgress}
            color={assignedPercentage < 15 ? "error" : assignedPercentage < 30 ? "warning" : assignedPercentage < 70 ? "info" : "success"}
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px"
  } as SxProps<Theme>,

  linearProgress: {
    height: "30px",
    borderRadius: "4px",
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%"
  } as SxProps<Theme>,

  progressContainer: {
    position: "relative",
    height: "30px"
  } as SxProps<Theme>,

  progressText: {
    position: "absolute",
    lineHeight: "30px",
    textAlign: "center",
    color: "common.white",
    left: "0",
    top: "0",
    width: "100%",
    zIndex: "2"
  } as SxProps<Theme>,
}