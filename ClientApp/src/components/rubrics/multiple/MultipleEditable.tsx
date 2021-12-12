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
    onEdit(event.target.value, id)
    // if (value !== event.target.value) {
      // const filteredResponses = responses.filter(item => item.response === event.target.value)
      // if (filteredResponses && filteredResponses.length > 0) onEdit(event.target.value, id)
    // }
  }, [])

  return (
    <RadioGroup
      defaultValue={value}
      onChange={handleRadioChange}
      name={id}
    >
      {responses.map((item, index) => (
        <FormControlLabel
          key={`${id}+${index}`}
          sx={styles.root}
          id={`${id}+${index}`}
          value={item.response}
          control={
            <Radio/>
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