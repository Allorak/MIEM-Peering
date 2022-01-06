import { FC } from "react";
import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { MultipleVisible } from "../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { RatingScaleVisible } from "../../../../../components/rubrics/ratingScale";
import { ShortTextVisible } from "../../../../../components/rubrics/shortText";
import { TextVisible } from "../../../../../components/rubrics/text";

import { IQuestionTypes, IMyWorkForm } from "../../../../../store/types";

interface IProps {
  myWork: IMyWorkForm,
  answerBoxColor?: string
}

export const MyWorkForm: FC<IProps> = ({
  myWork,
  answerBoxColor
}) => {

  const sorted = myWork.answers

  return (
    <Box sx={styles.wrapper}>
      {sorted.map(item => {
        return (
          <AnswerBox
            id={item.order}
            key={item.questionId}
            title={item.type === IQuestionTypes.SELECT_RATE && item.coefficientPercentage !== undefined ?
              `${item.title} (коэф. ${item.coefficientPercentage}%)` :
              item.title
            }
            required={item.required}
            description={item.description}
            borderColor={answerBoxColor}
          >
            <QuestionBox>
              {item.type === IQuestionTypes.MULTIPLE && (
                <MultipleVisible
                  responses={item.responses}
                  response={item.response}
                  isResponse
                />
              )}

              {item.type === IQuestionTypes.TEXT && (
                <TextVisible
                  response={item.response}
                  isResponse
                />
              )}

              {item.type === IQuestionTypes.SHORT_TEXT && (
                <ShortTextVisible
                  response={item.response?.toString()}
                  isResponse
                />
              )}

              {item.type === IQuestionTypes.SELECT_RATE && (
                <RatingScaleVisible
                  response={item.response}
                  isResponse
                />
              )}
            </QuestionBox>
          </AnswerBox>
        );
      })}
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