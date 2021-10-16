import { FC } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";


export const QuestionBox: FC = ({
  children
}) => {
  return (
    <Box>
      <Typography variant='body1'>
        Ответ
      </Typography>
      <Box sx={{margin: '0px 0px 10px 0px'}}>
        {children}
      </Box>
    </Box>
  )
}