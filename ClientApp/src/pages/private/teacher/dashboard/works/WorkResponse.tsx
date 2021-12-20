
import { FC } from "react";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { StudentWork } from "../checkings/StudentForm";

import { IStudentWork } from "../../../../../store/types";

import { scrollStyles } from "../../../../../const/styles";


interface IProps {
  responses: IStudentWork
}

export const WorkResponse: FC<IProps> = ({ responses }) => {
  return (
    <Box sx={styles.wrapper}>
      <StudentWork studentWork={responses} />
    </Box>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "calc(100vh - 183px - 62px)",
    '@media (max-width: 900px)': {
      maxHeight: "calc(100vh - 183px - 132px)",
    },
    overflowY: 'auto',
    ...scrollStyles
  } as SxProps<Theme>
}