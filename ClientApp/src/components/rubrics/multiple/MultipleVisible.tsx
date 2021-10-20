import { Box, FormControlLabel, Radio, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { IMultipleResponse } from "../../../store/types";


interface IProps {
  responses: IMultipleResponse[]
}

export const MultipleVisible: FC<IProps> = ({
  responses
}) => {

  return (
    <Tooltip
      title={"Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Box>
        {responses.map(item => (
          <FormControlLabel
            sx={styles.root}
            id={item.id.toString()}
            value={item.response}
            control={
              <Radio value={false} disabled />
            }
            label={
              <Typography variant={'h6'}>
                {item.response}
              </Typography>
            }
          />
        ))}
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