import { FC, useCallback } from "react";
import { Box, Button, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { MultipleEditable } from "../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { RatingScaleEditable } from "../../../../../components/rubrics/ratingScale";
import { ShortTextEditable } from "../../../../../components/rubrics/shortText";
import { TextEditable } from "../../../../../components/rubrics/text";

import { IAuthorForm, IAuthorFormResponses, IQuestionTypes } from "../../../../../store/types";

import * as globalStyles from "../../../../../const/styles";

interface IProps {
  authorForm: IAuthorForm,
  onSubmit: (formResponses: IAuthorFormResponses) => void
  onEdit: (value: string | number | undefined, questionId: string) => void
}

export const FormAuthor: FC<IProps> = ({ authorForm, onSubmit, onEdit }) => {

  const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    if (authorForm && authorForm.rubrics && authorForm.rubrics.length > 0) {
      for (const item of authorForm.rubrics) {
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

      const formResponses: IAuthorFormResponses = {
        answers: authorForm.rubrics.map((response) => {
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
    }
  }, [authorForm])

  return (
    <Box
      sx={styles.wrapper}
      component={'form'}
      onSubmit={submitForm}
    >
      {authorForm.rubrics.map((item, index) => (
        <AnswerBox
          id={item.order}
          key={item.questionId}
          title={item.title}
          required={item.required}
          description={item.description}
        >
          <QuestionBox>
            {item.type === IQuestionTypes.SHORT_TEXT && (
              <ShortTextEditable
                id={item.questionId}
                required={item.required}
                onEdit={onEdit}
                value={item.response}
              />
            )}

            {item.type === IQuestionTypes.TEXT && (
              <TextEditable
                id={item.questionId}
                required={item.required}
                onEdit={onEdit}
                value={item.response}
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
      <Box sx={styles.footerContainer}>
        <Typography
          variant={"body1"}
        >
          {"* Работу можно сдать только один раз"}
        </Typography>
        <Button
          type='submit'
          variant='contained'
        >
          {"Сдать работу"}
        </Button>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    maxHeight: "calc(100vh - 200px)",
    paddingRight: "5px",
    overflowY: "auto",
    display: "flex",
    gap: "5px",
    flexDirection: "column",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: "20px"
  } as SxProps<Theme>,
}
