import { FC, useCallback } from "react";
import { TextField } from "@mui/material";

interface IProps {
  value?: string
  onEdit: (value: string | undefined, id: string) => void,
  required: boolean,
  id: string
}

export const TextEditable: FC<IProps> = ({ value, onEdit, required, id }) => {

  const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onEdit(e.target.value ? e.target.value : undefined, id)
  }, [])

  return (
    <TextField
      type={"text"}
      variant='outlined'
      label={"Развернутый ответ"}
      required={required}
      error={required && !value}
      helperText={required && !value ? "Это обязательное поле" : undefined}
      multiline
      minRows={3}
      maxRows={10}
      onChange={onChangeHandler}
    />
  )
}