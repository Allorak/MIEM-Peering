import { TextField, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";

export const ShortTextVisible: FC = () => {
  return (
    <Tooltip
      title={"Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <TextField
        sx={styles.textField}
        name={'name'}
        variant='outlined'
        disabled
        label={"Напишите свой ответ здесь"}
      />
    </Tooltip>
  )
}

const styles = {
  textField: {
    "& * :hover": {
      cursor: 'not-allowed'
    }
  } as SxProps<Theme>
}