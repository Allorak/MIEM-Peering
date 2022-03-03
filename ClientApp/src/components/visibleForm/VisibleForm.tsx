import { FC } from "react";
import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { AnswerBox } from "../rubrics/answerBox";
import { MultipleVisible } from "../rubrics/multiple";
import { QuestionBox } from "../rubrics/questionBox";
import { RatingScaleVisible } from "../rubrics/ratingScale";
import { ShortTextVisible } from "../rubrics/shortText";
import { TextVisible } from "../rubrics/text";
import { FileUploadVisible } from "../rubrics/fileUpload/FileUploadVisible";

import { IQuestionTypes, IStudentWork } from "../../store/types";

interface IProps {
  form: IStudentWork,
  answerBoxColor?: string
}

export const VisibleForm: FC<IProps> = ({
  form,
  answerBoxColor
}) => {

  const sorted = form.responses

  return (
    <Box sx={styles.wrapper}>
      {sorted.map(item => {
        return (
          <AnswerBox
            id={item.order}
            key={item.questionId}
            title={item.type === IQuestionTypes.SELECT_RATE && typeof item.coefficientPercentage === 'number' ?
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
                  response={item.value}
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
                  response={item.value}
                  isResponse
                />
              )}

              {item.type === IQuestionTypes.FILE && (
                <FileUploadVisible
                  fileIds={item.fileIds}
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