import { ChangeEvent, FC, useCallback } from "react";
import { SxProps, Theme } from "@mui/system";
import { Box, Button, FormControlLabel, FormHelperText, Radio, RadioGroup, Typography } from "@mui/material";

import { IMultipleResponse } from "../../../store/types";


interface IProps {
  responses: IMultipleResponse[],
  value?: number
  onEdit: (value: number | undefined, id: string) => void,
  required: boolean,
  id: string
}

export const MultipleEditable: FC<IProps> = ({
  responses,
  value,
  onEdit,
  required,
  id
}) => {

  const handleRadioChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const choiceId = event.target.value
    if (!isNaN(Number(choiceId)))
      onEdit(Number(choiceId), id)
  }, [])

  const onReset = useCallback(() => {
    if (!required) onEdit(undefined, id)
  }, [])

  return (
    <>
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
            value={item.id}
            control={
              <Radio required={required} />
            }
            label={
              <Typography variant={'h6'}>
                {item.response}
              </Typography>
            }
            checked={value === item.id}
          />
        ))}
      </RadioGroup>

      {!required && typeof value !== 'undefined' && (
        <Box sx={styles.cancelContainer}>
          <Button variant="text" sx={styles.cancelButton} onClick={onReset}>
            {"Отменить выбор"}
          </Button>
        </Box>
      )}
    </>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: "10px"
  } as SxProps<Theme>,
  cancelContainer: {
    marginTop: "5px",
    display: "flex",
    justifyContent: "flex-end"
  } as SxProps<Theme>,
  cancelButton: {
    lineHeight: "12px",
    padding: "12px 7px",
    borderRadius: "7px",
    fontWeight: 700,
    color: "secondary.main"
  } as SxProps<Theme>,
}