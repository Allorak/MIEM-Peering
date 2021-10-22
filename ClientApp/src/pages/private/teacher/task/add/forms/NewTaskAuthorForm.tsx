import { Button, TextField } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { InputLabel } from "../../../../../../components/inputLabel";
import { Popup } from "../../../../../../components/popup";
import { AnswerBox } from "../../../../../../components/rubrics/answerBox";
import { MultipleVisible } from "../../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../../components/rubrics/questionBox";
import { ShortTextVisible } from "../../../../../../components/rubrics/shortText";
import { TextInput } from "../../../../../../components/textInput";
import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { defaultResponses, IMultipleQuiestion, IQuestionRubrics, IQuesttionTypes, ISelectRatingQuestion, IShortTextQuestion, ITextQuestion } from "../../../../../../store/types";
import { palette } from "../../../../../../theme/colors";
import * as fields from "../formFields"
import * as globalStyles from "../../../../../../const/styles";

export const NewTaskAuthorForm: FC = () => {

  const [questions, setQuestions] = useState<IQuestionRubrics>(initialQuestions)
  const [currentQuestion, setCurrentQuestion] = useState<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion | undefined>()
  const [popupStatus, setPopupStatus] = useState(false)

  const onEditQuestion = useCallback((id: number) => {
    const findQuestion = questions.find(question => question.id === id)
    if (findQuestion) {
      setCurrentQuestion(findQuestion)
      setPopupStatus(true)
    }
  }, [questions, setCurrentQuestion, currentQuestion])

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

  return (
    <Box sx={styles.questionContainer}>
      {questions.length && (questions.map((question) => {
        return (
          <AnswerBox
            id={question.id}
            title={question.title}
            onEdit={onEditQuestion}
            onClone={onCloneQuestion}
            onRemove={onRemoveQuestion}
            key={question.id}
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
      >
        {"Добавить вопрос"}
      </Button>

      <UpdateQuestion
        question={currentQuestion}
        popupStatus={popupStatus}
        closePopup={setPopupStatus}
      />
    </Box>
  )
}

interface IQuestionItem {
  question?: ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion
  popupStatus: boolean,
  closePopup(value: SetStateAction<boolean>): void
}

const UpdateQuestion: FC<IQuestionItem> = ({
  question,
  popupStatus,
  closePopup
}) => {

  const [questionEdited, setQuestionEdited] = useState<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion>(question ?? initialQuestion)
  const [formError, setFormError] = useState(false)


  console.log(question)
  const { control, handleSubmit, formState, reset } = useForm<{ title: string }>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      title: question?.title ?? "",
    }
  })
  useEffect(() => {
    if (popupStatus)
      reset({ title: question?.title ?? "" })
  }, [question, popupStatus])


  const { field: titleProps } = useController({ control, ...fields.titleProps })

  return (
    <Popup
      title={question ? `Вопрос ${question.id + 1}` : 'Добавить вопрос'}
      open={popupStatus}
      onCloseHandler={closePopup}
    >
      <Box
        component={'form'}
        onSubmit={() => console.log("11")}
      >
        {/* стили для загловка вопроса */}
        <Box>
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

        <Box sx={globalStyles.submitBtContainer}>
          <Button
            type='submit'
            variant='contained'
            disabled={formError}
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
}

const initialQuestions: IQuestionRubrics = [
  {
    id: 0,
    title: "Mention something that your classmate did well 👍",
    type: IQuesttionTypes.SHORT_TEXT
  },
  {
    id: 1,
    title: "Mention something that your classmate could improve at 📝",
    type: IQuesttionTypes.MULTIPLE,
    responses: [
      {
        id: 0,
        response: "response 1"
      },
      {
        id: 0,
        response: "response 2"
      },
      {
        id: 0,
        response: "response 3"
      },
      {
        id: 0,
        response: "response 4"
      }
    ]
  }
]

const initialQuestion: IShortTextQuestion = {
  id: 999,
  title: "",
  type: IQuesttionTypes.SHORT_TEXT,
}