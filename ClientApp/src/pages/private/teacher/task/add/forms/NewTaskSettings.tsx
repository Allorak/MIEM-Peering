//@ts-ignore
import { FC, useCallback, useMemo, useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker, TimePicker } from "@mui/lab";
import ruLocale from "date-fns/locale/ru";

import { InputLabel } from "../../../../../../components/inputLabel";

import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { INewTaskSettings, PeerSteps, PeerTaskTypes } from "../../../../../../store/types";

import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";

import { ExpertTable } from "../components/ExpertsTable";
import { ExpertUpdateForm } from "../components/ExpertUpdateForm";


interface IProps {
  onSubmit(questions: INewTaskSettings): void,
  hasConfidenceFactor: boolean
}

export const NewTaskSettings: FC<IProps> = ({ onSubmit, hasConfidenceFactor }) => {
  const [popupStatus, setPopupStatus] = useState(false)
  const [currentExpert, setCurrentExpert] = useState<string>()

  const { control, formState, getValues, setValue, watch } = useForm<INewTaskSettings>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      ...initialValue(),
      experts: hasConfidenceFactor ? undefined : [],
      badConfidencePenalty: -0.5,
      goodConfidenceBonus: 0.5
    }
  })

  const { field: maxSubmissionProps } = useController({ control, ...fields.maxSubmissionProps })
  const { field: submissionWeightProps } = useController({ control, ...fields.submissionWeightProps })
  const { field: reviewWeightProps } = useController({ control, ...fields.reviewWeightProps })
  const { field: typeProps } = useController({ control, ...fields.taskTypeProps })

  const { field: goodCoefficientBonusProps } = useController({ control, ...fields.goodCoefficientBonusProps })
  const { field: badCoefficientPenaltyProps } = useController({ control, ...fields.badCoefficientPenaltyProps })

  const experts = watch('experts')

  const handleAddOrEditExpert = useCallback((email?: string) => {
    setCurrentExpert(email)
    setPopupStatus(true)
  }, [])

  const handleExpertSubmit = useCallback((email: string) => {
    if (!hasConfidenceFactor) {
      if (currentExpert && experts && experts.length > 0) {
        if (currentExpert !== email) {
          const flag = experts.filter(expert => expert === email).length === 0
          if (flag) {
            const filteredExperts = experts.map(expert =>
              expert !== currentExpert ? expert : email
            )
            setValue('experts', JSON.parse(JSON.stringify(filteredExperts)))
          }
          setPopupStatus(false)
          return
        } else {
          setPopupStatus(false)
          return
        }
      }

      if (!currentExpert && experts) {
        const flag = experts.filter(expert => expert === email).length === 0

        if (flag) {
          const pushedExpert = [...JSON.parse(JSON.stringify(experts)), email]
          setValue('experts', JSON.parse(JSON.stringify(pushedExpert)))
        }

        setPopupStatus(false)
        return
      }
    }
  }, [currentExpert, experts, hasConfidenceFactor])

  const handleRemoveExpert = useCallback(() => {
    if (!hasConfidenceFactor && currentExpert && experts && experts.length > 0) {
      const filteredExperts = experts.filter(expert => expert !== currentExpert)
      setValue('experts', JSON.parse(JSON.stringify(filteredExperts)))
      setPopupStatus(false)
    }
  }, [currentExpert, experts, hasConfidenceFactor])

  const onSettingsFormSubmit = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()

    const request = getValues()
    if ((!hasConfidenceFactor && request.experts && request.experts.length > 0) || hasConfidenceFactor) {
      onSubmit(request)
    }
  }, [getValues, hasConfidenceFactor])

  return (
    <>
      <Box
        sx={styles.container}
        component={'form'}
        onSubmit={onSettingsFormSubmit}
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
                title={"Количество проверок (мин):"}
                required
                description={"Минимальное количество проверок для одной работы. Чем больше проверок, тем больше точность при вычислении итоговой оценки"}
              />

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
                title={"Выберите тип:"}
                required
                description={`Single blind. В этом типе рецензирования автор не знает, кто является рецензентом.
                
                Double blind. В этом типе рецензирования рецензенты не знают личности авторов, и наоборот.
                
                Open Peer Review. Личность автора и рецензента известна всем участникам во время или после процесса рецензирования.`}
              />

              <Select
                sx={{ display: "block" }}
                type={"text"}
                required
                inputProps={typeProps}
              >
                <MenuItem
                  key={PeerTaskTypes.SINGLE_BLIND}
                  value={PeerTaskTypes.SINGLE_BLIND}
                >
                  {"Single blind"}
                </MenuItem>

                <MenuItem
                  key={PeerTaskTypes.DOUBLE_BLIND}
                  value={PeerTaskTypes.DOUBLE_BLIND}
                >
                  {"Double blind"}
                </MenuItem>

                <MenuItem
                  key={PeerTaskTypes.OPEN}
                  value={PeerTaskTypes.OPEN}
                >
                  {"Open Peer review"}
                </MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={styles.dateBox}>
            <Box>
              <InputLabel
                title={"Вес проверки в итоговой оценке (%):"}
                required
                description={`Укажите сколько процентов от итоговой оценки составляет доля проверенных работ из назначенных`}
              />

              <TextField
                type={'number'}
                InputProps={reviewWeightProps}
                required
                variant={'outlined'}
                autoComplete={'off'}
                {...(formState.errors.reviewWeight !== undefined && { error: true, helperText: formState.errors.reviewWeight.message })}
              />
            </Box>
          </Box>

          <Box sx={styles.dateBox}>
            <Box>
              <InputLabel
                title={"Вес работы в итоговой оценке (%):"}
                required
                description={`Укажите сколько процентов от итоговой оценки составляет оценка, полученная студентом за его работу`}
              />

              <TextField
                type={'number'}
                InputProps={submissionWeightProps}
                required
                variant={'outlined'}
                autoComplete={'off'}
                {...(formState.errors.submissionWeight !== undefined && { error: true, helperText: formState.errors.submissionWeight.message })}
              />
            </Box>
          </Box>

          {hasConfidenceFactor && goodCoefficientBonusProps && badCoefficientPenaltyProps && (
            <>
              <Box sx={styles.dateBox}>
                <Box>
                  <InputLabel
                    title={"Штраф за плохой текущий коэф. доверия (по 10-ти бальной системе):"}
                    required
                    description={`Укажите сколько баллов отнимется от итоговой оценки студента, если у него будет «плохой (меньше чем 0.35)» коэффициент доверия на момент начала задания`}
                  />
                  <TextField
                    type={'number'}
                    InputProps={badCoefficientPenaltyProps}
                    required
                    variant={'outlined'}
                    autoComplete={'off'}
                    {...(formState.errors.badConfidencePenalty !== undefined && { error: true, helperText: formState.errors.badConfidencePenalty.message })}
                  />
                </Box>
              </Box>

              <Box sx={styles.dateBox}>
                <Box>
                  <InputLabel
                    required
                    title={"Бонус за хороший текущий коэф. доверия (по 10-ти бальной системе):"}
                    description={`Укажите сколько дополнительных баллов к итоговой оценке получит студент, если у него будет «хороший (больше чем 0.75)» коэффициент доверия на момент начала задания`} />
                  <TextField
                    type={'number'}
                    InputProps={goodCoefficientBonusProps}
                    required
                    variant={'outlined'}
                    autoComplete={'off'}
                    {...(formState.errors.goodConfidenceBonus !== undefined && { error: true, helperText: formState.errors.goodConfidenceBonus.message })}
                  />
                </Box>
              </Box>
            </>
          )}

          <Box sx={styles.dateBox}>
            <Box>
              <Typography variant={'h6'}>
                {hasConfidenceFactor ? secondStepInfo.name : firsStepInfo.name}
              </Typography>

              <Typography variant={'body1'}>
                {hasConfidenceFactor ? secondStepInfo.description : firsStepInfo.description}
              </Typography>
            </Box>
          </Box>
        </Box>

        {!hasConfidenceFactor && experts && (
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
            disabled={!hasConfidenceFactor && (!experts || experts.length === 0)}
          >
            {"Создать задание"}
          </Button>
        </Box>
      </Box>

      <ExpertUpdateForm
        popupStatus={popupStatus}
        onSubmit={handleExpertSubmit}
        onRemove={handleRemoveExpert}
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
    reviewType: PeerTaskTypes.DOUBLE_BLIND,
    submissionWeight: 80,
    reviewWeight: 20
  }

  return taskSettings
}

const firsStepInfo = {
  description: "В результате данного пирингового задания будут вычислены коэф. доверия. Необходимо участие экспертов",
  name: "Начальный этап"
}

const secondStepInfo = {
  description: "Для вычисления итоговой оценки работ будут использованы коэф. доверия студентов",
  name: "Основной этап"
}


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