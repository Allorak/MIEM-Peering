//@ts-ignore
import { FC } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker, TimePicker } from "@mui/lab";
import ruLocale from "date-fns/locale/ru";

import { InputLabel } from "../../../../../../components/inputLabel";

import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { INewTaskSettings } from "../../../../../../store/types";

import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";


interface IProps {
  onSubmit(questions: INewTaskSettings): void
}

export const NewTaskSettings: FC<IProps> = ({ onSubmit }) => {

  const { control, formState, handleSubmit } = useForm<INewTaskSettings>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      ...initialValue()
    }
  })

  const { field: maxSubmissionProps } = useController({ control, ...fields.maxSubmissionProps })

  return (
    <Box
      sx={styles.container}
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
    >
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
            <Controller
              control={control}
              name={'sBegin'}
              rules={fields.dateRules}
              render={({ field: { ref, ...rest } }) => (
                <Box sx={styles.fieldsContainer}>
                  <Box sx={styles.datePicker}>
                    <MobileDatePicker
                      inputFormat="dd.MM.yyyy"
                      rightArrowButtonText={'Следующий месяц'}
                      disablePast
                      disableCloseOnSelect={false}
                      toolbarTitle={false}
                      toolbarPlaceholder={false}
                      okText={"Выбрать"}
                      cancelText={"Отменить"}
                      OpenPickerButtonProps={{ itemScope: true }}
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                  <Box sx={styles.timePicker}>
                    <TimePicker
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                </Box>
              )}
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
            <Controller
              control={control}
              name={'sEnd'}
              rules={fields.dateRules}
              render={({ field: { ref, ...rest } }) => (
                <Box sx={styles.fieldsContainer}>
                  <Box sx={styles.datePicker}>
                    <MobileDatePicker
                      inputFormat="dd.MM.yyyy"
                      rightArrowButtonText={'Следующий месяц'}
                      disablePast
                      disableCloseOnSelect={false}
                      toolbarTitle={false}
                      toolbarPlaceholder={false}
                      okText={"Выбрать"}
                      cancelText={"Отменить"}
                      OpenPickerButtonProps={{ itemScope: true }}
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                  <Box sx={styles.timePicker}>
                    <TimePicker
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                </Box>
              )}
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
            <Controller
              control={control}
              name={'rBegin'}
              rules={fields.dateRules}
              render={({ field: { ref, ...rest } }) => (
                <Box sx={styles.fieldsContainer}>
                  <Box sx={styles.datePicker}>
                    <MobileDatePicker
                      inputFormat="dd.MM.yyyy"
                      rightArrowButtonText={'Следующий месяц'}
                      disablePast
                      disableCloseOnSelect={false}
                      toolbarTitle={false}
                      toolbarPlaceholder={false}
                      okText={"Выбрать"}
                      cancelText={"Отменить"}
                      OpenPickerButtonProps={{ itemScope: true }}
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                  <Box sx={styles.timePicker}>
                    <TimePicker
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                </Box>
              )}
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
            <Controller
              control={control}
              name={'rEnd'}
              rules={fields.dateRules}
              render={({ field: { ref, ...rest } }) => (
                <Box sx={styles.fieldsContainer}>
                  <Box sx={styles.datePicker}>
                    <MobileDatePicker
                      inputFormat="dd.MM.yyyy"
                      rightArrowButtonText={'Следующий месяц'}
                      disablePast
                      disableCloseOnSelect={false}
                      toolbarTitle={false}
                      toolbarPlaceholder={false}
                      okText={"Выбрать"}
                      cancelText={"Отменить"}
                      OpenPickerButtonProps={{ itemScope: true }}
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                  <Box sx={styles.timePicker}>
                    <TimePicker
                      {...rest}
                      renderInput={(params) =>
                        <TextField
                          variant={'outlined'}
                          sx={{ minWidth: '0px' }}
                          {...params}
                        />
                      }
                    />
                  </Box>
                </Box>
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={styles.dateBox}>
          <Box>
            <InputLabel
              title={"Количество проверок (мин):"} />

            <TextField
              type={'number'}
              InputProps={{ ...maxSubmissionProps, inputProps: { min: 0 } }}
              required
              variant={'outlined'}
              autoComplete={'off'}
              {...(formState.errors.maxSubmission !== undefined && { error: true, helperText: formState.errors.maxSubmission.message })}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={globalStyles.submitBtContainer}>
        <Button
          type='submit'
          variant='contained'
        >
          {"Создать задание"}
        </Button>
      </Box>
    </Box>
  )
}

const initialValue = (): INewTaskSettings => {
  const taskSettings = {
    sBegin: new Date(),
    sEnd: new Date(new Date().setDate(new Date().getDate() + 1)),
    rBegin: new Date(new Date().setDate(new Date().getDate() + 3)),
    rEnd: new Date(new Date().setDate(new Date().getDate() + 4)),
    maxSubmission: 2
  }

  taskSettings.sBegin.setHours(23, 59, 0)
  taskSettings.sEnd.setHours(23, 59, 0)
  taskSettings.rBegin.setHours(23, 59, 0)
  taskSettings.rEnd.setHours(23, 59, 0)
  return taskSettings
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
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as SxProps<Theme>,
  fieldsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '5px'
  } as SxProps<Theme>,
  datePicker: {
    flex: '1'
  } as SxProps<Theme>,
  timePicker: {
    flex: '1 0 120px'
  } as SxProps<Theme>,
}