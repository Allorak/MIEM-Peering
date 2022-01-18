import { FC, useCallback } from "react";
import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../rubrics/answerBox";
import { MultipleEditable } from "../rubrics/multiple";
import { QuestionBox } from "../rubrics/questionBox";
import { RatingScaleEditable } from "../rubrics/ratingScale";
import { ShortTextEditable } from "../rubrics/shortText";
import { TextEditable } from "../rubrics/text";

import { IPeerForm, IQuestionTypes, IPeerResponses } from "../../store/types";

import * as globalStyles from "../../const/styles";

interface IProps {
  form: IPeerForm,
  onSubmit: (formResponses: IPeerResponses) => void
  onEdit: (value: string | number | undefined, questionId: string) => void
}


export const EditableForm: FC<IProps> = ({ form, onSubmit, onEdit }) => {

  const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    for (const item of form.rubrics) {
      const isResponse = item.type === IQuestionTypes.SHORT_TEXT || item.type === IQuestionTypes.TEXT
      const isValue = item.type === IQuestionTypes.MULTIPLE || item.type === IQuestionTypes.SELECT_RATE

      if (item.required && isResponse && (typeof item.response === 'undefined' || (typeof item.response === 'string' && !item.response.trim()))) {
        console.log(item, "!", typeof item.response === 'undefined')
        return
      }

      if (item.required && isValue && typeof item.value === 'undefined') {
        console.log(item, "!", typeof item.value === 'undefined')
        return
      }
    }
    const formResponses: IPeerResponses = {
      answers: form.rubrics.map((response) => {
        switch (response.type) {
          case IQuestionTypes.TEXT:
          case IQuestionTypes.SHORT_TEXT:
            return {
              questionId: response.questionId,
              response: response.response?.trim()
            }

          case IQuestionTypes.SELECT_RATE:
          case IQuestionTypes.MULTIPLE:
            return {
              questionId: response.questionId,
              value: response.value
            }
        }
      })
    }
    onSubmit(formResponses)
  }, [form])

  return (
    <Box
      sx={styles.wrapper}
      component={'form'}
      onSubmit={submitForm}
    >
      {form.rubrics.map((item, index) => (
        <AnswerBox
          id={index}
          key={item.questionId}
          title={item.type === IQuestionTypes.SELECT_RATE && typeof item.coefficientPercentage === 'number' ?
            `${item.title} (коэф. ${item.coefficientPercentage}%)` :
            item.title
          }
          required={item.required}
          description={item.description}
        >
          <QuestionBox>
            {item.type === IQuestionTypes.SHORT_TEXT && (
              <ShortTextEditable
                id={item.questionId}
                required={item.required}
                value={item.response}
                onEdit={onEdit}
              />
            )}

            {item.type === IQuestionTypes.TEXT && (
              <TextEditable
                id={item.questionId}
                required={item.required}
                value={item.response}
                onEdit={onEdit}
              />
            )}

            {item.type === IQuestionTypes.MULTIPLE && (
              <MultipleEditable
                id={item.questionId}
                required={item.required}
                onEdit={onEdit}
                value={item.value}
                responses={JSON.parse(JSON.stringify(item.responses))}
              />
            )}

            {item.type === IQuestionTypes.SELECT_RATE && (
              <RatingScaleEditable
                id={item.questionId}
                required={item.required}
                onEdit={onEdit}
                value={item.value}
                maxValue={item.maxValue}
                minValue={item.minValue}
              />
            )}
          </QuestionBox>
        </AnswerBox>
      ))}

      <Box sx={{ ...globalStyles.submitBtContainer, ...{ marginTop: "20px" } }}>
        <Button
          type='submit'
          variant='contained'
        >
          {"Отправить"}
        </Button>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    gap: "5px",
    flexDirection: "column"
  } as SxProps<Theme>
}