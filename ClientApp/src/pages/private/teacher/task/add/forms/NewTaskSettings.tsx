//@ts-ignore
import { FC, useCallback, useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { display, SxProps, Theme } from "@mui/system";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker, TimePicker } from "@mui/lab";
import ruLocale from "date-fns/locale/ru";

import { InputLabel } from "../../../../../../components/inputLabel";

import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { IFirstStepSettings, INewTaskSettings, PeerSteps } from "../../../../../../store/types";

import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";
import { ExpertTable } from "../components/ExpertsTable";
import { ExpertUpdateForm } from "../components/ExpertUpdateForm";


interface IProps {
  onSubmit(questions: INewTaskSettings): void
}

interface IIterationCatalog {
  id: PeerSteps,
  name: string
}

export const NewTaskSettings: FC<IProps> = ({ onSubmit }) => {

  const [popupStatus, setPopupStatus] = useState(false)
  const [currentExpert, setCurrentExpert] = useState<string | undefined>("")

  const { control, formState, handleSubmit, getValues, setValue } = useForm<INewTaskSettings>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      ...initialValue()
    }
  })

  const { field: maxSubmissionProps } = useController({ control, ...fields.maxSubmissionProps })
  const { field: peerStepProps } = useController({ control, ...fields.peerStepProps })

  const experts = getValues('stepParams.experts')

  const handleOnStepChange = useCallback((value: SelectChangeEvent<unknown>) => {
    if (peerStepProps.value !== value.target.value) {
      if (value.target.value === PeerSteps.FIRST_STEP) {
        setValue('stepParams', {
          step: PeerSteps.FIRST_STEP,
          experts: []
        })
      } else {
        setValue('stepParams', {
          step: PeerSteps.SECOND_STEP,
          taskId: "1" //TODO
        })
      }
    }
  }, [setValue, peerStepProps])

  const handleAddOrEditExpert = useCallback((email?: string) => {
    if (email) {
      setCurrentExpert(email)
    } else {
      setCurrentExpert(undefined)
    }
    setPopupStatus(true)
  }, [])

  const onExpertSubmit = useCallback((email: string) => {
    if (peerStepProps.value === PeerSteps.FIRST_STEP) {
      if (currentExpert && experts.length > 0) {
        if (currentExpert !== email) {
          const flag = experts.filter(expert => expert === email).length === 0
          if (flag) {
            const filteredExperts = experts.map(expert =>
              expert !== currentExpert ? expert : email
            )
            setValue('stepParams.experts', JSON.parse(JSON.stringify(filteredExperts)))
            setPopupStatus(false)
            return
          }
        } else {
          setPopupStatus(false)
          return
        }
      }
      if (!currentExpert) {
        const pushedExpert = [...JSON.parse(JSON.stringify(experts)), email]
        setValue('stepParams.experts', JSON.parse(JSON.stringify(pushedExpert)))
        setPopupStatus(false)
        return
      }
    }
  }, [currentExpert, experts, peerStepProps, setValue])

  const onRemoveExpert = useCallback(() => {
    if (peerStepProps.value === PeerSteps.FIRST_STEP && currentExpert && experts.length > 0) {
      const filteredExperts = experts.filter(expert => expert !== currentExpert)
      setValue('stepParams.experts', JSON.parse(JSON.stringify(filteredExperts)))
      setPopupStatus(false)
    }
  }, [peerStepProps, currentExpert, experts, setValue])

  return (
    <>
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
                name={'submissionStartDateTime'}
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
                name={'submissionEndDateTime'}
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
                name={'reviewStartDateTime'}
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
                name={'reviewEndDateTime'}
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
                {...(formState.errors.submissionsToCheck !== undefined && { error: true, helperText: formState.errors.submissionsToCheck.message })}
              />
            </Box>
          </Box>

          <Box sx={styles.dateBox}>
            <Box>
              <InputLabel
                title={"Выберите итерацию:"}
                required
              />

              <Select
                sx={{ display: "block" }}
                type={"text"}
                required
                disabled
                inputProps={peerStepProps}
                onChange={handleOnStepChange}
              >
                {stepsCatalog.map(step => (
                  <MenuItem
                    key={step.id}
                    value={step.id}
                  >
                    {step.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>

        {peerStepProps.value === PeerSteps.FIRST_STEP && experts && (
          <ExpertTable
            experts={experts}
            onAdd={handleAddOrEditExpert}
            onEdit={handleAddOrEditExpert}
          />
        )}

        <Box sx={{ ...globalStyles.submitBtContainer, marginTop: "15px" }}>
          <Button
            type='submit'
            variant='contained'
          >
            {"Создать задание"}
          </Button>
        </Box>
      </Box>

      <ExpertUpdateForm
        popupStatus={popupStatus}
        onSubmit={onExpertSubmit}
        onRemove={onRemoveExpert}
        onCloseHandler={setPopupStatus}
        expert={currentExpert}
      />
    </>
  )
}

const initialValue = (): INewTaskSettings => {
  var submissionStartDateTime = new Date()
  submissionStartDateTime.setHours(23, 59, 0)

  var submissionEndDateTime = new Date()
  submissionEndDateTime.setDate(submissionStartDateTime.getDate() + 1)
  submissionEndDateTime.setHours(23, 59, 0)

  var reviewStartDateTime = new Date()
  reviewStartDateTime.setDate(submissionStartDateTime.getDate() + 3)
  reviewStartDateTime.setHours(23, 59, 0)

  var reviewEndDateTime = new Date()
  reviewEndDateTime.setDate(submissionStartDateTime.getDate() + 4)
  reviewEndDateTime.setHours(23, 59, 0)

  const taskSettings: INewTaskSettings = {
    submissionStartDateTime: submissionStartDateTime,
    submissionEndDateTime: submissionEndDateTime,
    reviewStartDateTime: reviewStartDateTime,
    reviewEndDateTime: reviewEndDateTime,
    submissionsToCheck: 2,
    stepParams: {
      step: PeerSteps.FIRST_STEP,
      experts: ['ivan@ivanov.ru']
    } as IFirstStepSettings
  }

  return taskSettings
}

const stepsCatalog: IIterationCatalog[] = [
  {
    id: PeerSteps.FIRST_STEP,
    name: "Этап 1"
  },
  {
    id: PeerSteps.SECOND_STEP,
    name: "Этап 2"
  }
]

const styles = {
  container: {
    maxWidth: '780px',
    margin: "0px auto 0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
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
    flex: '0 1 100%'
  } as SxProps<Theme>,
  timePicker: {
    flex: '1 0 120px'
  } as SxProps<Theme>,
}