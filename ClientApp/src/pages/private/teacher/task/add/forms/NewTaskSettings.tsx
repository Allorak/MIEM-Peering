//@ts-ignore
import { Box, TextField, Typography } from "@mui/material";
import DateAdapter from '@mui/lab/AdapterDateFns';
import ruLocale from "date-fns/locale/ru";
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
    console.log(newValue?.getDate(), 'value')
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
    <Box sx={styles.container}>
      <Box sx={styles.wrapper}>
        <Box sx={styles.dateBox}>
          <Typography variant={'h6'}>
            {"Период сдачи работ начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время, когда открывается период сдачи"}
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}
            locale={ruLocale}
          >
            <MobileDatePicker
              inputFormat="dd.MM.yyyy"
              value={settingValue.submission.begin}
              onChange={e => onDateChange(e, 0)}
              rightArrowButtonText={'Следующий месяц'}
              disablePast
              disableCloseOnSelect={false}
              toolbarTitle={false}
              toolbarPlaceholder={false}
              okText={"Выбрать"}
              cancelText={"Отменить"}
              renderInput={(params) =>
                <TextField
                  variant={'outlined'}
                  sx={{ minWidth: '0px' }}
                  {...params}
                />
              }
            />
          </LocalizationProvider>
        </Box>

        <Box sx={styles.dateBox}>
          <Typography variant={'h6'}>
            {"Период сдачи работ заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время окончания периода сдачи работ"}
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}
            locale={ruLocale}
          >
            <MobileDatePicker
              inputFormat="dd.MM.yyyy"
              value={settingValue.submission.end}
              onChange={e => onDateChange(e, 1)}
              rightArrowButtonText={'Следующий месяц'}
              disablePast
              disableCloseOnSelect={false}
              toolbarTitle={false}
              toolbarPlaceholder={false}
              okText={"Выбрать"}
              cancelText={"Отменить"}
              renderInput={(params) =>
                <TextField
                  variant={'outlined'}
                  sx={{ minWidth: '0px' }}
                  {...params}
                />
              }
            />
          </LocalizationProvider>
        </Box>

        <Box sx={styles.dateBox}>
          <Typography variant={'h6'}>
            {"Период проверки начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время начала периода проверки"}
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}
            locale={ruLocale}
          >
            <MobileDatePicker
              inputFormat="dd.MM.yyyy"
              value={settingValue.review.begin}
              onChange={e => onDateChange(e, 2)}
              rightArrowButtonText={'Следующий месяц'}
              disablePast
              disableCloseOnSelect={false}
              toolbarTitle={false}
              toolbarPlaceholder={false}
              okText={"Выбрать"}
              cancelText={"Отменить"}
              renderInput={(params) =>
                <TextField
                  variant={'outlined'}
                  sx={{ minWidth: '0px' }}
                  {...params}
                />
              }
            />
          </LocalizationProvider>
        </Box>

        <Box sx={styles.dateBox}>
          <Typography variant={'h6'}>
            {"Период проверки заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Выберите дату и время закрытия периода проверки"}
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}
            locale={ruLocale}
          >
            <MobileDatePicker
              inputFormat="dd.MM.yyyy"
              value={settingValue.review.end}
              onChange={e => onDateChange(e, 3)}
              rightArrowButtonText={'Следующий месяц'}
              disablePast
              disableCloseOnSelect={false}
              toolbarTitle={false}
              toolbarPlaceholder={false}
              okText={"Выбрать"}
              cancelText={"Отменить"}
              renderInput={(params) =>
                <TextField
                  variant={'outlined'}
                  sx={{ minWidth: '0px' }}
                  {...params}
                />
              }
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    maxWidth: '780px',
    margin: "0px auto 50px auto"
  } as SxProps<Theme>,
  wrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr) )",
    padding: '2px',
  } as SxProps<Theme>,
  dateBox: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px'
  } as SxProps<Theme>,
}