import { FC, useCallback, useEffect } from "react";
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { RegisterOptions, useController, useForm } from "react-hook-form";
import { FormReValidateMode, FormValidateMode } from "../../../const/common";

interface IProps {
  value?: number
  onEdit: (value: number | undefined, id: string) => void,
  required: boolean,
  id: string,
  minValue: number,
  maxValue: number
}

export const RatingScaleEditable: FC<IProps> = ({
  value,
  onEdit,
  required,
  id,
  minValue,
  maxValue
}) => {

  const rates = [] as Array<number>

  for (let i = minValue; i < maxValue + 1; i++) {
    rates.push(i)
  }

  const handleOnChange = useCallback((e: SelectChangeEvent<unknown>) => {
    if (!required && typeof e.target.value === 'undefined') onEdit(undefined, id)
    if (!isNaN(Number(e.target.value)) && value !== Number(e.target.value)) {
      const filtered = rates.filter(rate => (rate === Number(e.target.value)))
      if (filtered && filtered.length > 0) onEdit(Number(e.target.value), id)
    }
  }, [rates, value])

  return (
    <FormControl>
      <Select
        variant={"outlined"}
        sx={styles.textField}
        required={required}
        onChange={handleOnChange}
        value={value}
      >
        {!required && (
          <MenuItem>{"-"}</MenuItem>
        )}
        {rates.map(rate => (
          <MenuItem value={rate}>{rate}</MenuItem>
        ))}
      </Select>

      {required && value === undefined && (
        <FormHelperText>
          {"Это обязательное поле"}
        </FormHelperText>
      )}
    </FormControl>
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