import { Box, SxProps, Theme } from "@mui/system";
import { FC, useCallback, useState } from "react";
import { AnswerBox } from "../../../../../../components/rubrics/answerBox";
import { MultipleVisible } from "../../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../../components/rubrics/questionBox";
import { ShortTextVisible } from "../../../../../../components/rubrics/shortText";
import { defaultResponses, IQuestionRubrics, IQuesttionTypes } from "../../../../../../store/types";

export const NewTaskAuthorForm: FC = () => {

  const [questions, setQuestions] = useState<IQuestionRubrics>(initialQuestions)

  const onEditQuestion = useCallback((id: number) => {

  }, [])

  const onCloneQuestion = useCallback((id: number) => {

  }, [])

  const onRemoveQuestion = useCallback((id: number) => {

  }, [])

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
    </Box>
  )
}

const styles = {
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  } as SxProps<Theme>
}

const initialQuestions: IQuestionRubrics = [
  {
    id: 0,
    title: "Вопрос",
    type: IQuesttionTypes.SHORT_TEXT
  },
  {
    id: 1,
    title: "Вопрос",
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