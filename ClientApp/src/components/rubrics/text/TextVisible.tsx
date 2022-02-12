import { FC } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { scrollStyles } from "../../../const/styles";


interface IProps {
  response?: string
  isResponse?: boolean
}

export const TextVisible: FC<IProps> = ({ response, isResponse }) => {
  return (
    <Tooltip
      title={isResponse ? (response ? "Ответ записан" : "Нет ответа") : "Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Box sx={styles.visibleEditorWrapper}>
        <div
          {...(response && { dangerouslySetInnerHTML: { __html: response } })}
        />
        {!response && (
          <Typography
            variant={'body1'}
            color={'warning.main'}
            fontWeight={'700'}
          >
            {"Нет ответа"}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

const styles = {
  visibleEditorWrapper: {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '5px',
    padding: '5px',
    maxHeight: '60vh',
    overflow: 'auto',
    ...scrollStyles
  } as SxProps<Theme>
}