//@ts-ignore
import { Box, TextField, Typography } from "@mui/material";
import DateTimePicker from '@mui/lab/DateTimePicker';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { FC, useCallback, useState } from "react";
import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
import { INewTaskSettings } from "../../../../../../store/types";
import { SxProps, Theme } from "@mui/system";

export const NewTaskSettings: FC = () => {

  const [settingValue, setSettings] = useState<INewTaskSettings>({
    submission: {
      begin: new Date(),
      end: new Date()
    },
    review: {
      begin: new Date(),
      end: new Date()
    }
  } as INewTaskSettings)

  const onDateChange = useCallback((newValue: Date | null | undefined, state: number) => {
    if (newValue)
      switch (state) {
        case 0:
          setSettings(prev => ({
            ...prev,
            submission: {
              begin: newValue,
              end: prev.submission.end
            }
          }))
          break
        case 1:
          setSettings(prev => ({
            ...prev,
            submission: {
              end: newValue,
              begin: prev.submission.begin
            }
          }))
          break
        case 2:
          setSettings(prev => ({
            ...prev,
            review: {
              begin: newValue,
              end: prev.review.end
            }
          }))
          break
        case 3:
          setSettings(prev => ({
            ...prev,
            review: {
              end: newValue,
              begin: prev.review.begin
            }
          }))
          break
      }
  }, [setSettings])
  return (
    // grid
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Box sx={styles.wrapper}>
        <Box>
          <Typography variant={'h6'}>
            {"Период сдачи работ начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время, когда открывается период сдачи"}
          </Typography>

          <MobileDatePicker
            inputFormat="MM/dd/yyyy"
            value={settingValue.submission.begin}
            onChange={e => onDateChange(e, 0)}
            renderInput={(params) =>
              <TextField
                variant={'outlined'}
                sx={{minWidth: '0px'}}
                {...params}
              />
            }
          />
        </Box>

        <Box>
          <Typography variant={'h6'}>
            {"Период сдачи работ заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время окончания периода сдачи работ"}
          </Typography>

          <MobileDatePicker
            inputFormat="MM/dd/yyyy"
            value={settingValue.submission.end}
            onChange={e => onDateChange(e, 1)}
            renderInput={(params) =>
              <TextField
                variant={'outlined'}
                {...params}
              />
            }
          />
        </Box>

        <Box>
          <Typography variant={'h6'}>
            {"Период проверки начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время начала периода проверки"}
          </Typography>

          <MobileDatePicker
            inputFormat="MM/dd/yyyy"
            value={settingValue.review.begin}
            onChange={e => onDateChange(e, 2)}
            renderInput={(params) =>
              <TextField
                variant={'outlined'}
                {...params}
              />
            }
          />
        </Box>

        <Box>
          <Typography variant={'h6'}>
            {"Период проверки заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время закрытия периода проверки"}
          </Typography>

          <MobileDatePicker
            inputFormat="MM/dd/yyyy"
            value={settingValue.review.end}
            onChange={e => onDateChange(e, 3)}
            renderInput={(params) =>
              <TextField
                variant={'outlined'}
                {...params}
              />
            }
          />
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

const styles = {
  wrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr) )",
    margin: "0px 0px 15px 0px",
    padding: '2px',
  } as SxProps<Theme>
}