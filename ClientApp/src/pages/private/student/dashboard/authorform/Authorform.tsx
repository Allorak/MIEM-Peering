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

import { fetchAuthorformStudent, postAuthorformStudent } from "../../../../../store/authorformStudent";
import { IAuthorForm, IPeerResponses, IQuestionTypes } from "../../../../../store/types";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

export const Authorform: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const status = useAppSelector(state => state.authorForm.isLoading)
  const error = useAppSelector(state => state.authorForm.error)
  const authorForm = useAppSelector(state => state.authorForm.authorform)
  const [responses, setResponses] = useState<IAuthorForm>()

  const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
    event.preventDefault()
    if (responses && responses.rubrics && responses.rubrics.length > 0) {
      for (const item of responses.rubrics) {
        if (item.required && (typeof item.response === 'undefined' || (typeof item.response === 'string' && !item.response.trim()))) {
          console.log(item, "!", typeof item.response === 'undefined')
          return
        }
      }
      const formResponses: IPeerResponses = {
        responses: responses.rubrics.map((response, index) => {
          if (response.response !== undefined)
            return { questionId: `${index}`, response: typeof response.response === 'string' ? response.response.trim() : response.response }
          console.log(response.response !== undefined)
          return { questionId: `${index}` }
        })
      }
      onRequest(formResponses)
    }
  }, [responses])

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (path && path.taskId && formResponses.responses)
      dispatch(postAuthorformStudent(path.taskId, formResponses))
  }, [path])

  const handleOnFormEdit = useCallback((value: string | number | undefined, questionId: string) => {
    setResponses(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: JSON.parse(JSON.stringify(prev.rubrics.map((item, index) => {
            if (`${index}` !== questionId) return item
            if (item.type === IQuestionTypes.SELECT_RATE && (typeof value === 'number' || typeof value === 'undefined'))
              return { ...item, response: value }
            if (item.type !== IQuestionTypes.SELECT_RATE && (typeof value === 'string' || typeof value === 'undefined'))
              return { ...item, response: value }
          })))
        }
      }
    })
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
        onSubmit={submitForm}
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
                      value={item.response}
                    />
                  )}

                  {item.type === IQuestionTypes.TEXT && (
                    <TextEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                      value={item.response}
                    />
                  )}

                  {item.type === IQuestionTypes.MULTIPLE && (
                    <MultipleEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                      value={item.response}
                      responses={JSON.parse(JSON.stringify(item.responses))}
                    />
                  )}

                  {item.type === IQuestionTypes.SELECT_RATE && (
                    <RatingScaleEditable
                      id={`${index}`}
                      required={item.required}
                      onEdit={handleOnFormEdit}
                      value={item.response}
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
