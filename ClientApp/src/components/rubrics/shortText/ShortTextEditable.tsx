import { FC, useCallback } from "react";
import { TextField } from "@mui/material";

interface IProps {
  value?: string
  onEdit: (value: string | undefined, id: string) => void,
  required: boolean,
  id: string
}

export const ShortTextEditable: FC<IProps> = ({ value, onEdit, required, id }) => {

  const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onEdit(e.target.value ? e.target.value : undefined, id)
  }, [])

  return (
    <TextField
      type={"text"}
      variant='outlined'
      label={"Краткий ответ"}
      required={required}
      error={required && !value}
      helperText={required && !value ? "Это обязательное поле" : undefined}
      onChange={onChangeHandler}
    />
  )
}