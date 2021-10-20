import { FC } from "react";
import { Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";


export const QuestionBox: FC = ({
  children
}) => {
  return (
    <Box>
      <Typography variant='body1'>
        Ответ
      </Typography>
      <Box sx={styles.questionContainer}>
        {children}
      </Box>
    </Box>
  )
}

const styles = {
  questionContainer: {
    margin: "10px 0px 10px 0px",
    // padding: "15px"
  } as SxProps<Theme>
}