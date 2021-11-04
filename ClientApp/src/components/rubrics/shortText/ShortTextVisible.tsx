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
        label={"Краткий ответ"}
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