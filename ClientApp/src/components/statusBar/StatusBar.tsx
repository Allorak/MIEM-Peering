import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { LinearProgress, Typography } from "@mui/material";

import { IStatusBar } from "../../store/types";


interface IProps extends IStatusBar { }

export const StatusBar: FC<IProps> = ({
  submissions,
  total,
  review
}) => {

  const submissionPercentage = submissions * 100 / total
  const reviewPercentage = review * 100 / total

  return (
    <Box>
      <Box sx={styles.wrapper}>
        <Typography variant={'h6'}>
          {"Сдали работу:"}
        </Typography>

        <Box sx={styles.progressContainer}>
          <Typography
            variant={"h6"}
            sx={styles.progressText}
          >
            {`${submissions} из ${total}`}
          </Typography>

          <LinearProgress
            value={submissionPercentage}
            variant={"determinate"}
            sx={styles.linearProgress}
            color={submissionPercentage < 15 ? "error" :  submissionPercentage < 30 ? "warning" : submissionPercentage < 70 ? "info" : "success"}
          />
        </Box>

        <Typography variant={'h6'}>
          {"Проверили работу:"}
        </Typography>
        <Box sx={styles.progressContainer}>
          <Typography
            variant={"h6"}
            sx={styles.progressText}
          >
            {`${review} из ${total}`}
          </Typography>

          <LinearProgress
            value={reviewPercentage}
            variant={"determinate"}
            sx={styles.linearProgress}
            color={reviewPercentage < 15 ? "error" :  reviewPercentage < 30 ? "warning" : reviewPercentage < 70 ? "info" : "success"}
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