import { FC, useCallback, useEffect, useState } from "react";
import { Typography, Grid, useMediaQuery, Box, Theme } from "@mui/material";

import { DashboardWorkBox } from "../dashboardWorkBox";
import { EditableForm } from "../editableForm";
import { VisibleForm } from "../visibleForm";
import { WorksList } from "../workList";

import { fetchCheckingsWorkList, createReview, fetchStudentWork, fetchPeerForm } from "../../store/checkings";

import { IWorkItem, IQuestionTypes, IPeerForm } from "../../store/types";
import { IPeerResponses, IError, IStudentWork } from "../../store/types";

import { palette } from "../../theme/colors";
import { scrollStyles } from "../../const/styles";
import { SxProps } from "@mui/system";


interface IProps {
  taskId: string,
  accessToken: string,
  onCheckingListEmpty: () => void
}

export const CheckingsComponent: FC<IProps> = ({
  taskId,
  accessToken,
  onCheckingListEmpty
}) => {

  const matches = useMediaQuery('(max-width:899px)')

  const [isLoadingCheckingList, setLoadingCheckingList] = useState(false)
  const [checkingList, setCheckingList] = useState<IWorkItem[]>()

  const [isLoadingStudentWork, setLoadingStudentWork] = useState(false)
  const [studentWork, setStudentWork] = useState<IStudentWork>()

  const [isLoadingPeerForm, setLoadingPeerForm] = useState(false)

  const [isLoadingReview, setLoadingReview] = useState(false)

  const [error, setError] = useState<IError>()

  const [activeWorkId, setActivetWorkId] = useState<string | undefined>()
  const [review, setReview] = useState<IPeerForm>()

  useEffect(() => {
    getCheckingList()
  }, [])

  useEffect(() => {
    if (checkingList && checkingList.length > 0) {
      setActivetWorkId(checkingList[0].submissionId)
    }

    if (checkingList && checkingList.length === 0) {
      onCheckingListEmpty()
    }
  }, [checkingList, onCheckingListEmpty])

  useEffect(() => {
    if (activeWorkId) {
      getPeerForm()
      getStudentWork(activeWorkId)
    }
  }, [activeWorkId])

  const getCheckingList = useCallback(() => {
    setLoadingCheckingList(true)
    fetchCheckingsWorkList(taskId, accessToken).then(response => {
      if (response.success) {
        setCheckingList(JSON.parse(
          JSON.stringify(response.payload)
        ))
      } else {
        setCheckingList(undefined)
        setError(response.error)
      }
      setLoadingCheckingList(false)
    })
  }, [taskId, accessToken])

  const getStudentWork = useCallback((workId: string) => {
    if (checkingList && checkingList.length > 0) {
      setLoadingStudentWork(true)
      fetchStudentWork(taskId, workId, accessToken).then(response => {
        if (response.success) {
          setStudentWork({
            responses: JSON.parse(JSON.stringify(
              response.payload.answers
            ))
          })
        } else {
          setStudentWork(undefined)
          setError(response.error)
        }
        setLoadingStudentWork(false)
      })
    }
  }, [taskId, accessToken, checkingList])

  const getPeerForm = useCallback(() => {
    if (checkingList && checkingList.length > 0) {
      setLoadingPeerForm(true)
      fetchPeerForm(taskId, accessToken).then(response => {
        if (response.success) {
          resetReview(JSON.parse(
            JSON.stringify(response.payload)
          ))
        } else {
          setReview(undefined)
          setError(response.error)
        }
        setLoadingPeerForm(false)
      })
    }
  }, [taskId, accessToken, checkingList])

  const resetReview = useCallback((defaultValue: IPeerForm) => {
    if (checkingList && checkingList.length > 0) {
      setReview({
        rubrics: JSON.parse(JSON.stringify(
          defaultValue.rubrics.map(rubric => {
            if (rubric.type === IQuestionTypes.MULTIPLE && rubric.required)
              return { ...rubric, value: rubric.responses[0].id }
            if (rubric.type === IQuestionTypes.SELECT_RATE && rubric.required)
              return { ...rubric, value: rubric.minValue }
            return rubric
          })
        ))
      })
    }
  }, [checkingList])

  const handleOnSubmissionChange = useCallback((submissionId: string) => {
    if (submissionId !== activeWorkId) {
      setActivetWorkId(submissionId)
    }
  }, [activeWorkId])

  const handleOnFormEdit = useCallback((value: string | number | File | undefined, questionId: string) => {
    setReview(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: prev.rubrics.map(item => {
            if (item.questionId !== questionId) return item

            switch (item.type) {
              case IQuestionTypes.SELECT_RATE:
              case IQuestionTypes.MULTIPLE:
                return JSON.parse(JSON.stringify({
                  ...item,
                  ...(typeof value !== 'string' && typeof value !== 'object' && { value: value })
                }))

              case IQuestionTypes.SHORT_TEXT:
              case IQuestionTypes.TEXT:
                return JSON.parse(JSON.stringify({
                  ...item,
                  ...(typeof value !== 'number' && typeof value !== 'object' && { response: value?.trim() })
                }))

              case IQuestionTypes.FILE:
                return {
                  ...item,
                  ...(typeof value !== "number" && typeof value !== "string" && { file: value })
                }
            }
          })
        }
      }
    })
  }, [setReview])

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (activeWorkId && formResponses.answers) {
      setLoadingReview(true)
      createReview(taskId, activeWorkId, formResponses, accessToken).then(response => {
        if (response.success) {
          getCheckingList()
        } else {
          setError(response.error)
        }
        setLoadingReview(false)
      })
    }
  }, [activeWorkId, taskId, accessToken])

  return (
    <DashboardWorkBox
      isLoading={isLoadingCheckingList}
      error={error}
    >
      {checkingList && checkingList.length > 0 && activeWorkId && (
        <Grid
          container
          spacing={{ xs: "5px", md: "10px", lg: "25px" }}
          direction={matches ? 'row' : 'row-reverse'}
        >
          <Grid item xs={12} md={2} >
            <WorksList
              activeWorkId={activeWorkId}
              worksCatalog={checkingList}
              onWorkChange={handleOnSubmissionChange}
            />
          </Grid>

          <Grid item xs={12} md={10} >
            <DashboardWorkBox
              isLoading={isLoadingReview}
              error={error}
            >
              <Grid
                container xs={12}
                gap={{ xs: "5px", md: "10px" }}
                wrap={!matches ? 'nowrap' : 'wrap'}
              >
                <Grid item xs={12} md={6}>
                  <Box
                    display={'flex'}
                    height={'40px'}
                    alignItems={'center'}
                    mb={!matches ? "20px" : "10px"}
                  >
                    <Typography
                      variant={!matches ? "h5" : "h6"}
                      color={"#273AB5"}
                    >
                      {"Форма с ответами:"}
                    </Typography>
                  </Box>

                  <DashboardWorkBox
                    isLoading={isLoadingStudentWork}
                    error={error}
                  >
                    {studentWork && studentWork.responses && studentWork.responses.length > 0 && (
                      <Box
                        maxHeight={!matches ? "calc(100vh - 205px)" : "100%"}
                        sx={styles.formWrapper}
                      >
                        <VisibleForm
                          form={studentWork}
                          answerBoxColor={palette.fill.success}
                        />
                      </Box>
                    )}
                  </DashboardWorkBox>
                </Grid>

                <Grid item xs={12} md={6} maxHeight={"100%"} overflow={'hidden'}>
                  <Box
                    display={'flex'}
                    height={'40px'}
                    alignItems={'center'}
                    mb={!matches ? "20px" : "10px"}
                  >
                    <Typography
                      variant={!matches ? "h5" : "h6"}
                      color={"#273AB5"}
                    >
                      {"Форма для оценивания:"}
                    </Typography>
                  </Box>

                  <DashboardWorkBox
                    isLoading={isLoadingPeerForm}
                    error={error}
                  >
                    {review && review.rubrics && review.rubrics.length > 0 && (
                      <Box
                        maxHeight={!matches ? "calc(100vh - 205px)" : "100%"}
                        sx={styles.formWrapper}
                      >
                        <EditableForm
                          form={review}
                          onSubmit={onRequest}
                          onEdit={handleOnFormEdit}
                        />
                      </Box>
                    )}
                  </DashboardWorkBox>
                </Grid>
              </Grid>
            </DashboardWorkBox>
          </Grid>
        </Grid >
      )}
    </DashboardWorkBox >
  )
}

const styles = {
  formWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    pb: "5px",
    boxSizing: "border-box",
    ...scrollStyles
  } as SxProps<Theme>
}