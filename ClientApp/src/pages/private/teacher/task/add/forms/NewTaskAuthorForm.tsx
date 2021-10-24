import { Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { Box } from "@mui/material";
import { FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { InputLabel } from "../../../../../../components/inputLabel";
import { Popup } from "../../../../../../components/popup";
import { AnswerBox } from "../../../../../../components/rubrics/answerBox";
import { MultipleVisible } from "../../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../../components/rubrics/questionBox";
import { ShortTextVisible } from "../../../../../../components/rubrics/shortText";
import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { defaultResponses, IMultipleQuiestion, IQuestionRubrics, IQuesttionTypes, ISelectRatingQuestion, IShortTextQuestion, ITextQuestion } from "../../../../../../store/types";
import { palette } from "../../../../../../theme/colors";
import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  rubrics: IQuestionRubrics,
  onSubmit(questions: IQuestionRubrics): void
}

export const NewTaskAuthorForm: FC<IProps> = ({
  rubrics,
  onSubmit
}) => {

  const [questions, setQuestions] = useState<IQuestionRubrics>([])
  const [currentQuestion, setCurrentQuestion] = useState<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion>()
  const [popupStatus, setPopupStatus] = useState(false)

  useEffect(() => {
    setQuestions(() => {
      return rubrics.map(rubric => {
        switch (rubric.type) {
          case IQuesttionTypes.TEXT:
          case IQuesttionTypes.SHORT_TEXT:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type
            }
          case IQuesttionTypes.MULTIPLE:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type,
              responses: rubric.responses.map(response => ({ ...response }))
            }
          case IQuesttionTypes.SELECT_RATE:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type,
              minValue: rubric.minValue,
              maxValue: rubric.maxValue
            }
        }
      })
    })
  }, [rubrics])

  const onUpdate = useCallback((request: ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion) => {
    if (currentQuestion) {
      setQuestions(prev => {
        return prev.map(question => {
          return question.id === currentQuestion.id ? { ...request } : question
        })
      })
    } else {
      setQuestions(prev => {
        prev.push({
          ...request,
          id: prev.length
        })
        return prev
      })
    }
    resetCurrentStatus()
  }, [popupStatus, setPopupStatus, currentQuestion, setCurrentQuestion])

  const resetCurrentStatus = useCallback(() => {
    setCurrentQuestion(undefined)
    setPopupStatus(false)
  }, [])

  const onEditQuestion = useCallback((id: number) => {
    const findQuestion = questions.find(question => question.id === id)
    if (findQuestion) {
      setCurrentQuestion(() => {
        if (findQuestion.type === IQuesttionTypes.MULTIPLE)
          return { ...findQuestion, responses: findQuestion.responses.map(item => ({ ...item })) }
        return { ...findQuestion }
      })
      setPopupStatus(true)
    }
  }, [questions, setQuestions, currentQuestion, setPopupStatus, popupStatus, setCurrentQuestion])

  const onAddQuestion = useCallback(() => {
    setCurrentQuestion(undefined)
    setPopupStatus(true)
  }, [])

  const onCloneQuestion = useCallback((id: number) => {
    setQuestions(prev => {
      const findQuestion = prev.find(rubric => rubric.id === id)
      if (findQuestion) {
        const newRubrics = [] as IQuestionRubrics

        for (const item of prev) {
          if (item.id > id) {
            newRubrics.push({ ...item, id: item.id + 1 })
          }

          else if (item.id === id) {
            newRubrics.push(item)
            newRubrics.push({ ...item, id: item.id + 1 })
          }

          else newRubrics.push(item)
        }

        return newRubrics
      }
      return prev
    })
  }, [setQuestions, questions])

  const onRemoveQuestion = useCallback((id: number) => {
    setQuestions(prev => {
      const findQuestion = prev.find(rubric => rubric.id === id)
      if (findQuestion) {
        const newRubrics = [] as IQuestionRubrics

        for (const item of prev) {
          if (item.id > id) {
            newRubrics.push({ ...item, id: item.id - 1 })
          }

          else if (item.id < id) {
            newRubrics.push(item)
          }
        }

        return newRubrics
      }
      return prev
    })
  }, [setQuestions, questions])

  const submitStep = useCallback(() => {
    if (questions && questions.length > 0) {
      const cloneQuestions = questions.map(rubric => {
        switch (rubric.type) {
          case IQuesttionTypes.TEXT:
          case IQuesttionTypes.SHORT_TEXT:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type
            }
          case IQuesttionTypes.MULTIPLE:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type,
              responses: rubric.responses.map(response => ({ ...response }))
            }
          case IQuesttionTypes.SELECT_RATE:
            return {
              id: rubric.id,
              title: rubric.title,
              required: rubric.required,
              type: rubric.type,
              minValue: rubric.minValue,
              maxValue: rubric.maxValue
            }
        }
      })
      onSubmit(cloneQuestions)
    }
  }, [questions, rubrics])

  return (
    <Box sx={styles.questionContainer}>
      {questions.length > 0 && (questions.map((question) => {
        return (
          <AnswerBox
            id={question.id}
            title={question.title}
            onEdit={onEditQuestion}
            onClone={onCloneQuestion}
            onRemove={onRemoveQuestion}
            key={question.id}
            required={question.required}
          >
            <QuestionBox>
              {question.type === IQuesttionTypes.SHORT_TEXT && (
                <ShortTextVisible />
              )}

              {question.type === IQuesttionTypes.MULTIPLE && (
                <MultipleVisible responses={question.responses} />
              )}
            </QuestionBox>
          </AnswerBox>
        )
      }))}

      <Button
        variant={'contained'}
        sx={styles.addBt}
        onClick={onAddQuestion}
      >
        {"Добавить вопрос"}
      </Button>

      <Box sx={globalStyles.submitBtContainer}>
        <Button
          type='button'
          variant='contained'
          onClick={submitStep}
        >
          {"Далее"}
        </Button>
      </Box>

      <UpdateQuestion
        question={currentQuestion}
        popupStatus={popupStatus}
        closePopup={setPopupStatus}
        onSubmit={onUpdate}
      />
    </Box>
  )
}

interface IQuestionItem {
  question?: ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion
  popupStatus: boolean,
  closePopup(value: SetStateAction<boolean>): void,
  onSubmit: (rubric: ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion) => void
}

const UpdateQuestion: FC<IQuestionItem> = ({
  question,
  popupStatus,
  closePopup,
  onSubmit
}) => {

  const { control, formState, reset, setValue, getValues } = useForm<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      id: question?.id ?? 9999,
      title: question?.title ?? "",
      required: question?.required ?? false,
      type: question?.type ?? IQuesttionTypes.SHORT_TEXT
    }
  })

  useEffect(() => {
    if (popupStatus) {
      console.log(question, "QUEST")
      reset(question ? { ...question } : { ...initialQuestion })
      console.log(getValues('required'), "TYPE")
    }
  }, [reset, popupStatus])

  const { field: titleProps } = useController({ control, ...fields.titleAuthorProps })
  const { field: requiredProps } = useController({ control, ...fields.requiredProps })
  const { field: typeProps } = useController({ control, ...fields.typeProps })
  const { field: responsesProps } = useController({ control, ...fields.responsesProps })
  const { field: minValueProps } = useController({ control, ...fields.minAuthorProps })
  const { field: maxValueProps } = useController({ control, ...fields.maxAuthorProps })

  const changeType = useCallback((type: IQuesttionTypes) => {
    setValue('type', type)
    if (type === IQuesttionTypes.MULTIPLE && (!getValues('responses') || getValues('responses').length === 0)) {
      setValue('responses', defaultResponses.multiple)
    }
    if (type === IQuesttionTypes.SELECT_RATE && (getValues('minValue') === undefined || getValues('maxValue') === undefined)) {
      setValue('minValue', defaultResponses.rateResponses.minValue)
      setValue('maxValue', defaultResponses.rateResponses.maxValue)
    }
  }, [setValue])

  const changeRequired = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('required', event.target.checked)
  }, [setValue])

  const responseChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, id: number) => {
    if (getValues('type') === IQuesttionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map(response => {
        return response.id === id ? { response: event.target.value, id: response.id } : response
      })
      setValue('responses', cloneResponses)

    }
  }, [getValues, setValue])

  const addResponse = useCallback(() => {
    if (getValues('type') === IQuesttionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map((response, index) => ({ response: response.response, id: index }))
      cloneResponses.push({ id: cloneResponses[length - 1].id + 1, response: `Вариант ${cloneResponses.length + 1}` })
      setValue('responses', cloneResponses)
    }
  }, [getValues, setValue])

  const removeResponse = useCallback((id: number) => {
    if (getValues('type') === IQuesttionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map(response => ({ ...response }))
      if (cloneResponses && cloneResponses.length > 0) {
        const newResponses = cloneResponses.filter(response => response.id !== id).map((response, index) => ({ response: response.response, id: index }))
        setValue('responses', newResponses)
      }
    }
  }, [getValues, setValue])

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    const request = getValues()
    if (request.type === IQuesttionTypes.MULTIPLE) {
      if (request.responses && request.responses.length > 0)
        onSubmit({
          id: request.id,
          required: request.required,
          type: IQuesttionTypes.MULTIPLE,
          responses: request.responses.map(response => ({ ...response })),
          title: request.title
        })
    }

    if (request.type === IQuesttionTypes.SHORT_TEXT) {
      onSubmit({
        id: request.id,
        required: request.required,
        type: IQuesttionTypes.SHORT_TEXT,
        title: request.title
      })
    }

    if (request.type === IQuesttionTypes.TEXT) {
      onSubmit({
        id: request.id,
        required: request.required,
        type: IQuesttionTypes.TEXT,
        title: request.title
      })
    }

    if (request.type === IQuesttionTypes.SELECT_RATE) {
      if (request.minValue && request.maxValue && request.maxValue - request.minValue > 0)
        onSubmit({
          id: request.id,
          required: request.required,
          type: IQuesttionTypes.SELECT_RATE,
          title: request.title,
          minValue: request.minValue,
          maxValue: request.maxValue
        })
    }
  }, [getValues, question])

  return (
    <Popup
      title={question ? `Вопрос ${question.id + 1}` : 'Добавить вопрос'}
      open={popupStatus}
      onCloseHandler={closePopup}
    >
      <Box
        component={'form'}
        onSubmit={onFormSubmit}
      >
        <Box sx={styles.titleBox}>
          <InputLabel
            required
            title={'Вопрос'}
          />

          <TextField
            type={'text'}
            InputProps={titleProps}
            required
            autoComplete={'off'}
            rows={2}
            multiline
            {...(formState.errors.title !== undefined && { error: true, helperText: formState.errors.title.message })}
          />
        </Box>

        <Box sx={styles.typeActionBox}>
          <Box
            sx={typeProps.value === IQuesttionTypes.MULTIPLE ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuesttionTypes.MULTIPLE)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Шкала"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuesttionTypes.SHORT_TEXT ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuesttionTypes.SHORT_TEXT)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Тескт (строка)"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuesttionTypes.TEXT ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuesttionTypes.TEXT)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Тескт (абзац)"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuesttionTypes.SELECT_RATE ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuesttionTypes.SELECT_RATE)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Оценка"}
            </Typography>
          </Box>
        </Box>

        {typeProps.value === IQuesttionTypes.MULTIPLE && (
          <Box
            sx={styles.multipleBox}
          >
            {responsesProps.value && responsesProps.value.length > 0 && responsesProps.value.map((response, index) => (
              <Box
                key={index}
                sx={styles.multipleItemBox}
              >
                <Box
                  sx={{ width: '100%' }}
                >
                  <InputLabel
                    required
                    title={`Вариант ${index + 1}`}
                  />

                  <TextField
                    required
                    value={response.response}
                    type={'text'}
                    autoComplete={'off'}
                    onChange={(e) => responseChange(e, response.id)}
                    {...(!responsesProps.value[index].response && { error: true, helperText: 'Введите значение' })}
                    {...(responsesProps.value[index].response && responsesProps.value.find(item => item.response === responsesProps.value[index].response && item.id !== responsesProps.value[index].id) && { error: true, helperText: 'Ошибка' })}

                  />
                </Box>

                {index > 1 && (
                  <Button
                    startIcon={<DeleteIcon />}
                    variant={'contained'}
                    sx={styles.deleteBt}
                    onClick={() => removeResponse(response.id)}
                  />
                )}
              </Box>
            ))}
            <Button
              type={'button'}
              variant={'contained'}
              sx={styles.addResponseBt}
              onClick={() => addResponse()}
            >
              {"Добавить вариант"}
            </Button>
          </Box>
        )}

        {typeProps.value === IQuesttionTypes.SELECT_RATE && (
          <Box sx={styles.minMaxBox}>
            <Box>
              <InputLabel
                required
                title={'Минимальная'}
              />

              <TextField
                type={'number'}
                InputProps={{
                  ...minValueProps,
                  inputProps: { min: 0, max: 100 }

                }}
                required
                autoComplete={'off'}
                {...(formState.errors.minValue !== undefined && { error: true, helperText: formState.errors.minValue.message })}
              />
            </Box>

            <Box>
              <InputLabel
                required
                title={'Максимальная'}
              />

              <TextField
                type={'number'}
                required
                autoComplete={'off'}
                InputProps={{
                  ...maxValueProps,
                  inputProps: { min: minValueProps.value ? Number(Number(minValueProps.value) + Number(1)) : 1, max: 100 }

                }}
                {...(formState.errors.maxValue !== undefined && { error: true, helperText: formState.errors.maxValue.message })}
                {...(getValues('minValue') && maxValueProps.value && getValues('minValue') >= maxValueProps.value && { error: true, helperText: "Ошибка" })}
              />
            </Box>
          </Box>
        )}

        <FormControlLabel
          control={
            <Switch
              onChange={changeRequired}
              name="required"
              checked={requiredProps.value}
            />
          }
          label={"Обязательный вопрос"}
          sx={styles.reqiredBox}
        />

        <Box sx={globalStyles.submitBtContainer}>
          <Button
            type='submit'
            variant='contained'
          >
            {question ? "Изменить" : "Добавить"}
          </Button>
        </Box>
      </Box>
    </Popup>
  )
}

const styles = {
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  } as SxProps<Theme>,
  addBt: {
    backgroundColor: 'secondary.main',
    margin: '10px 0px',
    ":hover": {
      backgroundColor: palette.hover.secondary
    }
  } as SxProps<Theme>,
  titleBox: {
    margin: "0px 0px 15px 0px"
  } as SxProps<Theme>,
  rubricTypeBt: {
    color: 'common.black',
    height: '30px',
    borderRadius: '4px',
    flex: '1 0 100%',
    padding: '10px',
    backgroundColor: '#F8F9FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ":hover": {
      cursor: 'pointer',
      border: `1px solid ${palette.divider}`,
    }
  } as SxProps<Theme>,
  rubricTypeActiveBt: {
    color: 'common.white',
    backgroundColor: 'secondary.main',
    ":hover": {
      cursor: 'not-allowed'
    }
  } as SxProps<Theme>,
  typeActionBox: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr) )",
    margin: "0px 0px 15px 0px",
    padding: '2px',
  } as SxProps<Theme>,
  reqiredBox: {
    margin: "0px 0px 15px 0px"
  } as SxProps<Theme>,
  deleteBt: {
    lineHeight: '1',
    fontSize: '12px',
    minWidth: "54px",
    padding: '12px',
    height: '54px',
    alignSelf: 'flex-end',
    backgroundColor: 'error.main',
    "& .MuiButton-startIcon": {
      margin: "0px",
    },
    ":hover": {
      backgroundColor: palette.hover.danger
    }
  } as SxProps<Theme>,
  multipleBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '0px 0px 15px 0px',
  } as SxProps<Theme>,
  multipleItemBox: {
    display: 'flex',
    gap: '5px'
  } as SxProps<Theme>,
  addResponseBt: {
    backgroundColor: 'secondary.main',
    ":hover": {
      backgroundColor: palette.hover.secondary
    }
  } as SxProps<Theme>,
  minMaxBox: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr) )",
    margin: "15px 0px 15px 0px",
    padding: '2px',
  } as SxProps<Theme>,
}

const initialQuestion: IShortTextQuestion = {
  id: 999,
  title: "Введите свой вопрос",
  type: IQuesttionTypes.SHORT_TEXT,
  required: false
}