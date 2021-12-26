import { FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import * as globalStyles from "../../../../../const/styles";

import { AnswerBox } from "../../../../../components/rubrics/answerBox";
import { MultipleEditable } from "../../../../../components/rubrics/multiple";
import { QuestionBox } from "../../../../../components/rubrics/questionBox";
import { RatingScaleEditable } from "../../../../../components/rubrics/ratingScale";
import { ShortTextEditable } from "../../../../../components/rubrics/shortText";
import { TextEditable } from "../../../../../components/rubrics/text";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchAuthorformStudent } from "../../../../../store/authorformStudent";
import { IAuthorForm, IQuestionTypes } from "../../../../../store/types";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

export const Authorform: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const status = useAppSelector(state => state.authorForm.isLoading)
  const error = useAppSelector(state => state.authorForm.error)
  const authorForm = useAppSelector(state => state.authorForm.authorform)
  const [responses, setResponses] = useState<IAuthorForm>()

  const handleOnFormEdit = useCallback(() => {
    return
  }, [responses])

  useEffect(() => {
    if (authorForm && authorForm.rubrics && authorForm.rubrics.length > 0) {
        setResponses(JSON.parse(JSON.stringify(authorForm)))
      }
    }, [authorForm])

  useEffect(() => {
    if (path && path.taskId) {
      dispatch(fetchAuthorformStudent(path.taskId))
    }
  }, [])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      <Box
        sx={styles.wrapper}
        component={'form'}
      >
        {responses && responses.rubrics && responses.rubrics.length > 0 && (
          <>
            {responses.rubrics.map((item, index) => (
              <AnswerBox
                id={index}
                key={index}
                title={item.title}
                required={item.required}
                description={item.description}
              >
                <QuestionBox>
                  {item.type === IQuestionTypes.SHORT_TEXT && (
                    <ShortTextEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                    />
                  )}

                  {item.type === IQuestionTypes.TEXT && (
                    <TextEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                    />
                  )}

                  {item.type === IQuestionTypes.MULTIPLE && (
                    <MultipleEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                      responses={JSON.parse(JSON.stringify(item.responses))}
                    />
                  )}

                  {item.type === IQuestionTypes.SELECT_RATE && (
                    <RatingScaleEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                      maxValue={item.maxValue}
                      minValue={item.minValue}
                    />
                  )}
                </QuestionBox>
              </AnswerBox>
            ))}
          </>
        )}
        <Box sx={{ ...globalStyles.submitBtContainer, ...{ marginTop: "20px" } }}>
          <Button
            type='submit'
            variant='contained'
          >
            {"Отправить"}
          </Button>
        </Box>
      </Box>
    </DashboardWorkBox>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    gap: "5px",
    flexDirection: "column"
  } as SxProps<Theme>
}
