import { FC, useCallback } from "react";
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { RegisterOptions, useController, useForm } from "react-hook-form";
import { FormReValidateMode, FormValidateMode } from "../../../const/common";

interface IProps {
  value?: number
  onEdit: (value: number, id: string) => void,
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

  const { control, formState } = useForm<{ response: number }>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      response: value !== undefined ? value : required ? (rates.length > 0 ? rates[0] : 999) : undefined
    }
  })

  const valueRules: RegisterOptions = {
    required: {
      value: required,
      message: "Это обязательное поле"
    }
  }

  const { field: valueProps } = useController({
    name: "response",
    control,
    rules: valueRules
  })

  const handleOnChange = useCallback((e: SelectChangeEvent<unknown>) => {
    if (!isNaN(Number(e.target.value)) && valueProps.value !== Number(e.target.value)) {
      const filtered = rates.filter(rate => (rate === Number(e.target.value)))
      if (filtered && filtered.length > 0) onEdit(Number(e.target.value), id)
    }
  }, [rates])

  return (
    <FormControl>
      <Select
        inputProps={valueProps}
        variant={"outlined"}
        sx={styles.textField}
        required={required}
        onChange={handleOnChange}
      >
        {!required && (
          <MenuItem value={''}>{"-"}</MenuItem>
        )}
        {rates.map(rate => (
          <MenuItem value={rate}>{rate}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{formState.errors.response !== undefined ? formState.errors.response.message : ""}</FormHelperText>
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