import { FC } from "react";
import { TextField, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";


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
      <TextField
        sx={styles.textField}
        name={'name'}
        variant='outlined'
        InputProps={{
          readOnly: true,
        }}
        label={"Развернутый ответ"}
        multiline
        value={response ?? ""}
        {...(isResponse === undefined && { rows: 3 })}
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