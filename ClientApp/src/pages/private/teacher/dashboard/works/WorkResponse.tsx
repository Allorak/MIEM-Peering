import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { AuthorResponse } from "../../../../../components/rubrics/authorResponse";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { scrollStyles } from "../../../../../const/styles";
import { IWorkResponse } from "../../../../../store/types";


interface IProps {
  responses: IWorkResponse[]
}

export const WorkResponse: FC<IProps> = ({ responses }) => {
  return (
    <Box sx={styles.wrapper}>
      {responses && responses.length > 0 && (
        responses.map(response => (
          <AnswerBox
            id={response.order}
            key={response.id}
            title={response.title}
            required={false}
          >
            <QuestionBox>
              <AuthorResponse
                response={response.response}
              />
            </QuestionBox>
          </AnswerBox>
        ))
      )}
    </Box>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "calc(100vh - 183px - 62px)",
    overflowY: 'auto',
    ...scrollStyles
  } as SxProps<Theme>
}