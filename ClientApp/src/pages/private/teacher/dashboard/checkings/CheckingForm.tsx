import { FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { MultipleEditable } from "../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { RatingScaleEditable } from "../../../../../components/rubrics/ratingScale";
import { ShortTextEditable } from "../../../../../components/rubrics/shortText";
import { TextEditable } from "../../../../../components/rubrics/text";

import { IPeerForm, IQuestionTypes, IPeerResponses } from "../../../../../store/types";


import * as globalStyles from "../../../../../const/styles";

interface IProps {
  peerForm: IPeerForm,
  onSubmit: (formResponses: IPeerResponses) => void
  onEdit: (value: string | number | undefined, questionId: string) => void
}

export const CheckingsForm: FC<IProps> = ({ peerForm, onSubmit, onEdit }) => {

  const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    for (const item of peerForm) {
      if (item.required && (typeof item.response === 'undefined' || (typeof item.response === 'string' && !item.response.trim()))) {
        console.log(item, "!", typeof item.response === 'undefined')
        return
      }
    }
    const formResponses: IPeerResponses = {
      responses: peerForm.map(response => {
        if (response.response !== undefined)
          return { questionId: response.id, response: typeof response.response === 'string' ? response.response.trim() : response.response }
        return { questionId: response.id }
      })
    }
    onSubmit(formResponses)
  }, [peerForm])

  return (
    <Box
      sx={styles.wrapper}
      component={'form'}
      onSubmit={submitForm}
    >
      {peerForm.map((item, index) => (
        <AnswerBox
          id={index}
          key={item.id}
          title={item.title}
          required={item.required}
        >
          <QuestionBox>
            {item.type === IQuestionTypes.SHORT_TEXT && (
              <ShortTextEditable
                id={item.id}
                required={item.required}
                value={item.response}
                onEdit={onEdit}
              />
            )}

            {item.type === IQuestionTypes.TEXT && (
              <TextEditable
                id={item.id}
                required={item.required}
                value={item.response}
                onEdit={onEdit}
              />
            )}

            {item.type === IQuestionTypes.MULTIPLE && (
              <MultipleEditable
                id={item.id}
                required={item.required}
                onEdit={onEdit}
                value={item.response}
                responses={JSON.parse(JSON.stringify(item.responses))}
              />
            )}

            {item.type === IQuestionTypes.SELECT_RATE && (
              <RatingScaleEditable
                id={item.id}
                required={item.required}
                onEdit={onEdit}
                value={item.response}
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