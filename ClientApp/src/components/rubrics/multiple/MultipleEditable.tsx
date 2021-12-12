import { ChangeEvent, FC, useCallback } from "react";
import { SxProps, Theme } from "@mui/system";
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, Typography } from "@mui/material";

import { IMultipleResponse } from "../../../store/types";


interface IProps {
  responses: IMultipleResponse[],
  value?: string
  onEdit: (value: string, id: string) => void,
  required: boolean,
  id: string
}

export const MultipleEditable: FC<IProps> = ({
  responses,
  value,
  onEdit,
  id
}) => {

  const handleRadioChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (value !== event.target.value) {
      const filteredResponses = responses.filter(item => item.response === event.target.value)
      if (filteredResponses && filteredResponses.length > 0) onEdit(event.target.value, id)
    }
  }, [])

  return (
    <RadioGroup
      value={value}
      onChange={handleRadioChange}
    >
      {responses.map((item, index) => (
        <FormControlLabel
          key={item.id}
          sx={styles.root}
          id={item.id.toString()}
          value={item.response}
          control={
            <Radio value={item.response} />
          }
          label={
            <Typography variant={'h6'}>
              {item.response}
            </Typography>
          }
        />
      ))}
    </RadioGroup>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: "10px"
  } as SxProps<Theme>
}