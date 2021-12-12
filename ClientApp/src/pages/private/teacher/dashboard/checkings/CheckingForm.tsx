import { FC, useCallback } from "react";
import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { MultipleEditable } from "../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { RatingScaleEditable } from "../../../../../components/rubrics/ratingScale";
import { ShortTextEditable } from "../../../../../components/rubrics/shortText";
import { TextEditable } from "../../../../../components/rubrics/text";

import { IPeerForm, IQuestionTypes } from "../../../../../store/types";


import * as globalStyles from "../../../../../const/styles";

interface IProps {
  peerForm: IPeerForm,
  onResponseeEdit: (value: string | number, questionId: string) => void
}

export const CheckingsForm: FC<IProps> = ({ peerForm, onResponseeEdit }) => {

  const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
  }, [])

  return (
    <Box
      sx={styles.wrapper}
      component={'form'}
      onSubmit={submitForm}
    >
      {peerForm.map(item => (
        <AnswerBox
          id={item.order}
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
                onEdit={onResponseeEdit}
              />
            )}

            {item.type === IQuestionTypes.TEXT && (
              <TextEditable
                id={item.id}
                required={item.required}
                value={item.response}
                onEdit={onResponseeEdit}
              />
            )}

            {item.type === IQuestionTypes.MULTIPLE && (
              <MultipleEditable
                id={item.id}
                required={item.required}
                onEdit={onResponseeEdit}
                value={item.response}
                responses={JSON.parse(JSON.stringify(item.responses))}
              />
            )}

            {item.type === IQuestionTypes.SELECT_RATE && (
              <RatingScaleEditable
                id={item.id}
                required={item.required}
                onEdit={onResponseeEdit}
                value={item.response}
                maxValue={item.maxValue}
                minValue={item.minValue}
              />
            )}
          </QuestionBox>
        </AnswerBox>
      ))}

      <Box sx={{...globalStyles.submitBtContainer, ...{marginTop: "20px"}}}>
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