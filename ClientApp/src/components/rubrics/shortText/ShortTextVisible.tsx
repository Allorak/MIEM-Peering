import { TextField, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";

interface IProps {
  response?: string
  isResponse?: boolean,
}

export const ShortTextVisible: FC<IProps> = ({ response, isResponse }) => {
  return (
    <Tooltip
      title={isResponse ? (response ? "Ответ записан" : "Нет ответа") : "Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <TextField
        sx={styles.textField}
        name={'name'}
        variant='outlined'
        disabled
        label={"Краткий ответ"}
        {...(response && { value: response })}
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