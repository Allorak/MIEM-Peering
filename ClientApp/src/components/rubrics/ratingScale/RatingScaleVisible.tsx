import { FC } from "react";
import { MenuItem, Select, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface IProps {
  response?: number
  isResponse?: boolean,
}

export const RatingScaleVisible: FC<IProps> = ({
  response,
  isResponse,
}) => {

  const rate = "Оценка"

  return (
    <Tooltip
      title={isResponse ? (response ? "Ответ записан" : "Нет ответа") : "Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Select
        value={response ?? rate}
        variant={"outlined"}
        disabled
        sx={styles.textField}
      >
        <MenuItem value={response ?? rate}>{response ?? rate}</MenuItem>
      </Select>
    </Tooltip>
  )
}

const styles = {
  textField: {
    "& * :hover": {
      cursor: 'not-allowed'
    },
    maxWidth: "100px"
  } as SxProps<Theme>
}