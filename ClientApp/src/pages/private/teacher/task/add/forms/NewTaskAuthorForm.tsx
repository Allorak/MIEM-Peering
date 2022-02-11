import { FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Button, FormControlLabel, Switch, TextField, Typography, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';

import { InputLabel } from "../../../../../../components/inputLabel";
import { Popup } from "../../../../../../components/popup";
import { AnswerBox } from "../../../../../../components/rubrics/answerBox";
import { MultipleVisible } from "../../../../../../components/rubrics/multiple";
import { TextVisible } from "../../../../../../components/rubrics/text";
import { QuestionBox } from "../../../../../../components/rubrics/questionBox";
import { ShortTextVisible } from "../../../../../../components/rubrics/shortText";
import { RatingScaleVisible } from "../../../../../../components/rubrics/ratingScale";
import { FileUploadPreview } from "../../../../../../components/rubrics/fileUpload/FileUploadPreview";

import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { palette } from "../../../../../../theme/colors";

import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";

import {
  defaultResponses,
  INewMultipleQuiestion,
  INewQuestionRubrics,
  IQuestionTypes,
  INewSelectRatingQuestion,
  INewShortTextQuestion,
  INewTextQuestion,
  INewUploadFileQuestion
} from "../../../../../../store/types";


interface IProps {
  rubrics: INewQuestionRubrics,
  onSubmit(questions: INewQuestionRubrics): void,
  isPeerForm?: boolean
}

export const NewTaskAuthorForm: FC<IProps> = ({
  rubrics,
  isPeerForm,
  onSubmit
}) => {

  const [questions, setQuestions] = useState<INewQuestionRubrics>([])
  const [currentQuestion, setCurrentQuestion] = useState<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion>()
  const [popupStatus, setPopupStatus] = useState(false)

  useEffect(() => {
    setQuestions(() => {
      return rubrics.map(rubric => {
        switch (rubric.type) {
          case IQuestionTypes.TEXT:
          case IQuestionTypes.SHORT_TEXT:
          case IQuestionTypes.FILE:
            return {
              order: rubric.order,
              title: rubric.title,
              required: rubric.required,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              type: rubric.type
            }
          case IQuestionTypes.MULTIPLE:
            return {
              order: rubric.order,
              title: rubric.title,
              required: rubric.required,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              type: rubric.type,
              responses: JSON.parse(JSON.stringify(rubric.responses))
            }
          case IQuestionTypes.SELECT_RATE:
            return {
              order: rubric.order,
              title: rubric.title,
              required: rubric.required,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              type: rubric.type,
              minValue: rubric.minValue,
              maxValue: rubric.maxValue,
              ...(isPeerForm && { coefficientPercentage: rubric.coefficientPercentage })
            }
        }
      })
    })
  }, [rubrics])

  const onUpdate = useCallback((request: INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion) => {
    if (currentQuestion) {
      setQuestions(prev => {
        return prev.map(question => {
          return question.order === currentQuestion.order ? { ...request } : question
        })
      })
    } else {
      setQuestions(prev => {
        prev.push({
          ...request,
          order: prev.length
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
    const findQuestion = questions.find(question => question.order === id)
    if (findQuestion) {
      setCurrentQuestion(() => {
        if (findQuestion.type === IQuestionTypes.MULTIPLE)
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
      const findQuestion = prev.find(rubric => rubric.order === id)
      if (findQuestion) {
        const newRubrics = [] as INewQuestionRubrics

        for (const item of prev) {
          if (item.order > id) {
            newRubrics.push({ ...item, order: item.order + 1 })
          }

          else if (item.order === id) {
            newRubrics.push(item)
            newRubrics.push({ ...item, order: item.order + 1 })
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
      const findQuestion = prev.find(rubric => rubric.order === id)
      if (findQuestion) {
        const newRubrics = [] as INewQuestionRubrics

        for (const item of prev) {
          if (item.order > id) {
            newRubrics.push({ ...item, order: item.order - 1 })
          }

          else if (item.order < id) {
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
          case IQuestionTypes.TEXT:
          case IQuestionTypes.SHORT_TEXT:
          case IQuestionTypes.FILE:
            return {
              order: rubric.order,
              title: rubric.title,
              required: rubric.required,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              type: rubric.type
            }
          case IQuestionTypes.MULTIPLE:
            return {
              order: rubric.order,
              title: rubric.title,
              required: rubric.required,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              type: rubric.type,
              responses: JSON.parse(JSON.stringify(rubric.responses))
            }
          case IQuestionTypes.SELECT_RATE:
            return {
              order: rubric.order,
              title: rubric.title,
              description: rubric.description && rubric.description.trim() !== "" ? rubric.description.trim() : undefined,
              required: rubric.required,
              type: rubric.type,
              minValue: rubric.minValue,
              maxValue: rubric.maxValue,
              ...(isPeerForm && { coefficientPercentage: rubric.coefficientPercentage })
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
            id={question.order}
            title={isPeerForm && question.type === IQuestionTypes.SELECT_RATE && question.coefficientPercentage ?
              `${question.title} (коэф. ${question.coefficientPercentage}%)` :
              question.title
            }
            onEdit={onEditQuestion}
            onClone={onCloneQuestion}
            onRemove={onRemoveQuestion}
            key={question.order}
            required={question.required}
            description={question.description}
          >
            <QuestionBox>
              {question.type === IQuestionTypes.SHORT_TEXT && (
                <ShortTextVisible />
              )}

              {question.type === IQuestionTypes.MULTIPLE && (
                <MultipleVisible responses={question.responses} />
              )}

              {question.type === IQuestionTypes.TEXT && (
                <TextVisible />
              )}

              {question.type === IQuestionTypes.SELECT_RATE && (
                <RatingScaleVisible />
              )}

              {question.type === IQuestionTypes.FILE && (
                <FileUploadPreview />
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
        isPeerForm={isPeerForm}
      />
    </Box>
  )
}

interface IQuestionItem {
  question?: INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion
  popupStatus: boolean,
  closePopup(value: SetStateAction<boolean>): void,
  onSubmit: (rubric: INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion | INewUploadFileQuestion) => void,
  isPeerForm?: boolean
}

const UpdateQuestion: FC<IQuestionItem> = ({
  question,
  popupStatus,
  closePopup,
  onSubmit,
  isPeerForm
}) => {

  const [isSelectRate, setIsSelectRate] = useState<boolean>()

  const { control, formState, reset, setValue, getValues } = useForm<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      order: question?.order ?? 9999,
      title: question?.title ?? "",
      required: question?.required ?? false,
      type: question?.type ?? IQuestionTypes.SHORT_TEXT
    }
  })

  useEffect(() => {
    if (popupStatus) {
      reset(question ? { ...question } : { ...initialQuestion })
      setIsSelectRate(isPeerForm && question && question.type === IQuestionTypes.SELECT_RATE ? true : undefined)
    }
  }, [popupStatus])

  const { field: titleProps } = useController({ control, ...fields.titleAuthorProps })
  const { field: requiredProps } = useController({ control, ...fields.requiredProps })
  const { field: typeProps } = useController({ control, ...fields.typeProps })
  const { field: responsesProps } = useController({ control, ...fields.responsesProps })
  const { field: minValueProps } = useController({ control, ...fields.minAuthorProps })
  const { field: maxValueProps } = useController({ control, ...fields.maxAuthorProps })
  const { field: descriptionProps } = useController({ control, ...fields.descriptionRubricsProps })
  const { field: coefficientProps } = useController({
    control,
    name: "coefficientPercentage",
    rules: {
      required: {
        value: isPeerForm ? true : false,
        message: "Это обязательное поле"
      },
      min: {
        value: 1,
        message: "Минимальное значение 1"
      },
      max: {
        value: 100,
        message: "Максимальное значение 100"
      }
    }
  })

  const changeType = useCallback((type: IQuestionTypes) => {
    setValue('type', type)
    if (type === IQuestionTypes.MULTIPLE && (!getValues('responses') || getValues('responses').length === 0)) {
      setValue('responses', defaultResponses.multiple)
    }
    if (type === IQuestionTypes.SELECT_RATE && (getValues('minValue') === undefined || getValues('maxValue') === undefined)) {
      setValue('minValue', defaultResponses.rateResponses.minValue)
      setValue('maxValue', defaultResponses.rateResponses.maxValue)
    }

    if (type === IQuestionTypes.SELECT_RATE && isPeerForm) {
      setIsSelectRate(true)
      setValue('required', true)
    } else {
      setIsSelectRate(undefined)
    }
  }, [setValue, question, isPeerForm])

  const changeRequired = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('required', event.target.checked)
  }, [setValue])

  const responseChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, id: number) => {
    if (getValues('type') === IQuestionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map(response => {
        return response.id === id ? { response: event.target.value, id: response.id } : response
      })
      setValue('responses', cloneResponses)

    }
  }, [getValues, setValue, question])

  const addResponse = useCallback(() => {
    if (getValues('type') === IQuestionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map((response, index) => ({ response: response.response, id: index }))
      cloneResponses.push({ id: cloneResponses[length - 1].id + 1, response: `Вариант ${cloneResponses.length + 1}` })
      setValue('responses', cloneResponses)
    }
  }, [getValues, setValue, question])

  const removeResponse = useCallback((id: number) => {
    if (getValues('type') === IQuestionTypes.MULTIPLE) {
      const cloneResponses = getValues('responses').map(response => ({ ...response }))
      if (cloneResponses && cloneResponses.length > 0) {
        const newResponses = cloneResponses.filter(response => response.id !== id).map((response, index) => ({ response: response.response, id: index }))
        setValue('responses', newResponses)
      }
    }
  }, [getValues, setValue, question])

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    const request = getValues()
    if (request.type === IQuestionTypes.MULTIPLE) {
      if (request.responses && request.responses.length > 0)
        onSubmit({
          order: request.order,
          required: request.required,
          type: IQuestionTypes.MULTIPLE,
          description: request.description && request.description.trim() !== "" ? request.description.trim() : undefined,
          responses: request.responses.map(response => ({ ...response })),
          title: request.title
        })
    }

    if (request.type === IQuestionTypes.SHORT_TEXT) {
      onSubmit({
        order: request.order,
        required: request.required,
        type: IQuestionTypes.SHORT_TEXT,
        description: request.description && request.description.trim() !== "" ? request.description.trim() : undefined,
        title: request.title
      })
    }

    if (request.type === IQuestionTypes.TEXT) {
      onSubmit({
        order: request.order,
        description: request.description && request.description.trim() !== "" ? request.description.trim() : undefined,
        required: request.required,
        type: IQuestionTypes.TEXT,
        title: request.title
      })
    }

    if (request.type === IQuestionTypes.FILE) {
      onSubmit({
        order: request.order,
        description: request.description && request.description.trim() !== "" ? request.description.trim() : undefined,
        required: request.required,
        type: IQuestionTypes.FILE,
        title: request.title
      })
    }

    if (request.type === IQuestionTypes.SELECT_RATE) {
      if (request.minValue !== undefined && request.maxValue !== undefined && request.maxValue - request.minValue > 0)
        onSubmit({
          order: request.order,
          required: request.required,
          description: request.description && request.description.trim() !== "" ? request.description.trim() : undefined,
          type: IQuestionTypes.SELECT_RATE,
          title: request.title,
          minValue: request.minValue,
          maxValue: request.maxValue,
          ...(isPeerForm && { coefficientPercentage: request.coefficientPercentage })
        })
    }
  }, [getValues, question])

  return (
    <Popup
      title={question ? `Вопрос ${question.order + 1}` : 'Добавить вопрос'}
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
            {...(formState.errors.title !== undefined && { error: true, helperText: formState.errors.title.message })}
          />

          <InputLabel
            title={'Описание'}
          />

          <TextField
            type={'text'}
            InputProps={descriptionProps}
            autoComplete={'off'}
            rows={3}
            multiline
            maxRows={3}
            {...(formState.errors.description !== undefined && { error: true, helperText: formState.errors.description.message })}
          />
        </Box>

        <Box sx={styles.typeActionBox}>
          <Box
            sx={typeProps.value === IQuestionTypes.MULTIPLE ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuestionTypes.MULTIPLE)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Шкала"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuestionTypes.SHORT_TEXT ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuestionTypes.SHORT_TEXT)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Тескт (строка)"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuestionTypes.TEXT ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuestionTypes.TEXT)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Тескт (абзац)"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuestionTypes.SELECT_RATE ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuestionTypes.SELECT_RATE)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Оценка"}
            </Typography>
          </Box>

          <Box
            sx={typeProps.value === IQuestionTypes.FILE ? { ...styles.rubricTypeBt, ...styles.rubricTypeActiveBt } : styles.rubricTypeBt}
            onClick={() => changeType(IQuestionTypes.FILE)}
          >
            <Typography
              variant={'h6'}
              sx={{ color: 'inherit' }}
            >
              {"Загрузка файла"}
            </Typography>
          </Box>
        </Box>

        {typeProps.value === IQuestionTypes.MULTIPLE && (
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

        {typeProps.value === IQuestionTypes.SELECT_RATE && (
          <>
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
                    inputProps: { min: getValues('minValue') !== undefined ? Number(Number(minValueProps.value) + Number(1)) : 1, max: 100 }

                  }}
                  {...(formState.errors.maxValue !== undefined && { error: true, helperText: formState.errors.maxValue.message })}
                  {...(getValues('minValue') && maxValueProps.value && getValues('minValue') >= maxValueProps.value && { error: true, helperText: "Ошибка" })}
                />
              </Box>
            </Box>

            {isPeerForm && (
              <Box>
                <InputLabel
                  required
                  title={'Весовой коэффициент (в процентах)'}
                />

                <TextField
                  type={'number'}
                  InputProps={coefficientProps}
                  autoComplete={'off'}
                  required
                  {...(formState.errors.coefficientPercentage !== undefined && { error: true, helperText: formState.errors.coefficientPercentage.message })}
                />
              </Box>
            )}
          </>
        )}

        <FormControlLabel
          control={
            <Switch
              onChange={changeRequired}
              name="required"
              checked={requiredProps.value}
              disabled={isPeerForm && isSelectRate}
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
    boxSizing: 'border-box',
    color: 'common.black',
    height: '50px',
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

const initialQuestion: INewShortTextQuestion = {
  order: 999,
  title: "Введите свой вопрос",
  type: IQuestionTypes.SHORT_TEXT,
  required: false
}