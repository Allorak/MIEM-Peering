import { Box, FormControlLabel, Radio, RadioGroup, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { IMultipleResponse } from "../../../store/types";


interface IProps {
  responses: IMultipleResponse[],
  response?: number,
  isResponse?: boolean
}

export const MultipleVisible: FC<IProps> = ({
  responses,
  response,
  isResponse
}) => {

  return (
    <Tooltip
      title={isResponse ? (response ? "Ответ записан" : "Нет ответа") : "Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Box>
        <RadioGroup
          name="radio-buttons-group"
          {...(response !== undefined && {value: response})}
        >
          {responses.map((item, index) => (
            <FormControlLabel
              key={index}
              sx={styles.root}
              id={item.id.toString()}
              value={item.id}
              control={
                <Radio value={item.id} readOnly/>
              }
              label={
                <Typography variant={'h6'}>
                  {item.response}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </Box>
    </Tooltip>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: "10px",
    ":hover": {
      cursor: 'not-allowed'
    }
  } as SxProps<Theme>
}