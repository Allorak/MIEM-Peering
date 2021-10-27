import { FC } from "react";
import { TextField, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";


export const TextVisible: FC = () => {
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
        label={"Развернутый ответ"}
        rows={3}
        multiline
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