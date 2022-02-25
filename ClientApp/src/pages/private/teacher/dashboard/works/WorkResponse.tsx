
import { FC } from "react";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { VisibleForm } from "../../../../../components/visibleForm";

import { IStudentWork } from "../../../../../store/types";

import { scrollStyles } from "../../../../../const/styles";
import { palette } from "../../../../../theme/colors";


interface IProps {
  responses: IStudentWork
}

export const WorkResponse: FC<IProps> = ({ responses }) => {
  return (
    <Box sx={styles.wrapper}>
      <VisibleForm
        answerBoxColor={palette.fill.info}
        form={responses}
      />
    </Box>
  )
}

const styles = {
  wrapper: {
    maxHeight: "calc(100vh - 146px - 62px)",
    pb: "5px",
    boxSizing: "border-box",
    '@media (max-width: 899px)': {
      maxHeight: "calc(100vh - 258px)",
    },
    overflowY: 'auto',
    ...scrollStyles
  } as SxProps<Theme>
}