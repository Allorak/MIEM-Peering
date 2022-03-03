import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Theme, Typography, useMediaQuery } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { AccessTime } from "../../../../../components/assessTime";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { NoData } from "../../../../../components/noData";
import { VisibleForm } from "../../../../../components/visibleForm";
import { WorksList } from "../../../../../components/workList";

import { fetchSubmissionPossibility } from "../../../../../store/authorformStudent";
import { fetchReviewStatus, fetchSubmissionStatus } from "../../../../../store/deadlineStatus";
import { fetchSubmission, fetchSubmissionId, fetchReviews } from "../../../../../store/myWork";

import { DeadlineStatus, IError, IMyWorkForm, IMyWorkReviews, IRole, ISubmissionStatus, IWorkItem } from "../../../../../store/types";

import { palette } from "../../../../../theme/colors";
import { scrollStyles } from "../../../../../const/styles";


export const MyWork: FC = () => {
  const { path } = usePrivatePathStDashboard()

  const matches = useMediaQuery('(max-width:899px)')

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const [isLoadingDeadlineStatus, setLoadingDeadlineStatus] = useState(false)
  const [submissionDeadlineStatus, setSubmissionDeadlineStatus] = useState<DeadlineStatus>()
  const [reviewDeadlineStatus, setReviewDeadlineStatus] = useState<DeadlineStatus>()


  const [isLoadingSubmissionPossibility, setLoadingSubmissionPossibility] = useState(false)
  const [submissionPossibility, setSubmissionPossibility] = useState<ISubmissionStatus>()

  const [isLoadingSubmissionId, setLoadingSubmissionId] = useState(false)
  const [submissionId, setSubmissionId] = useState<string>()

  const [isLoadingSubmission, setLoadingSubmission] = useState(false)
  const [submission, setSubmission] = useState<IMyWorkForm>()

  const [isLoadingReview, setLoadingReview] = useState(false)
  const [review, setReview] = useState<IMyWorkReviews>()

  const [error, setError] = useState<IError>()

  const [activeReviewId, setActiveReviewId] = useState<string>()

  useEffect(() => {
    getSubmissionStatus()
  }, [])

  useEffect(() => {
    getSubmissionPossibility()
    getReviewDeadline()
  }, [submissionDeadlineStatus])

  useEffect(() => {
    getSubmissionId()
  }, [submissionPossibility])

  useEffect(() => {
    getSubmission()
  }, [submissionId])

  useEffect(() => {
    getReview()
  }, [submission, reviewDeadlineStatus])

  useEffect(() => {
    if (review && review.length > 0) {
      setActiveReviewId(review[0].reviewId)
    }
  }, [review])

  const getSubmissionStatus = useCallback(() => {
    if (path && path.taskId && accessToken) {
      setLoadingDeadlineStatus(true)
      fetchSubmissionStatus(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionDeadlineStatus(response.payload.state)
        } else {
          setSubmissionDeadlineStatus(undefined)
          setError(response.error)
        }
        setLoadingDeadlineStatus(false)
      })
    }
  }, [path, accessToken])

  const getReviewDeadline = useCallback(() => {
    if (path && path.taskId && accessToken && submissionDeadlineStatus === DeadlineStatus.END) {
      setLoadingDeadlineStatus(true)
      fetchReviewStatus(path.taskId, accessToken).then(response => {
        if (response.success) {
          setReviewDeadlineStatus(response.payload.state)
        } else {
          setReviewDeadlineStatus(undefined)
          setError(response.error)
        }
        setLoadingDeadlineStatus(false)
      })
    }
  }, [path, accessToken, submissionDeadlineStatus])

  const getSubmissionPossibility = useCallback(() => {
    if (path && path.taskId && accessToken && submissionDeadlineStatus && submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED) {
      setLoadingSubmissionPossibility(true)
      fetchSubmissionPossibility(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionPossibility(response.payload)
        } else {
          setSubmissionPossibility(undefined)
          setError(error)
        }
        setLoadingSubmissionPossibility(false)
      })
    }
  }, [submissionDeadlineStatus, path, accessToken])

  const getSubmissionId = useCallback(() => {
    if (path && path.taskId && accessToken && submissionDeadlineStatus &&
      submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED &&
      submissionPossibility === ISubmissionStatus.COMPLETED) {

      setLoadingSubmissionId(true)
      fetchSubmissionId(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionId(response.payload.submissionId)
        } else {
          setError(response.error)
          setSubmissionId(undefined)
          setSubmission(undefined)
        }
        setLoadingSubmissionId(false)
      })
    }
  }, [submissionDeadlineStatus, submissionPossibility, path, accessToken])

  const getSubmission = useCallback(() => {
    if (submissionId && accessToken && submissionDeadlineStatus &&
      submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED &&
      submissionPossibility === ISubmissionStatus.COMPLETED) {

      setLoadingSubmission(true)
      fetchSubmission(submissionId, accessToken).then(response => {
        if (response.success) {
          setSubmission(response.payload)
        } else {
          setError(response.error)
          setSubmission(undefined)
        }
        setLoadingSubmission(false)
      })
    }
  }, [submissionId, accessToken, submissionDeadlineStatus, submissionPossibility])

  const getReview = useCallback(() => {
    if (submissionDeadlineStatus === DeadlineStatus.END &&
      accessToken && submissionId && submission && path && path.taskId &&
      submissionPossibility === ISubmissionStatus.COMPLETED && reviewDeadlineStatus &&
      reviewDeadlineStatus !== DeadlineStatus.NOT_STARTED) {

      setLoadingReview(true)
      fetchReviews(path.taskId, accessToken).then(response => {
        if (response.success) {
          setReview(response.payload)
        } else {
          setError(response.error)
          setReview(undefined)
        }
        setLoadingReview(false)
      })
    }
  }, [path, submissionId, accessToken, submissionDeadlineStatus, submissionPossibility, reviewDeadlineStatus])

  const handleReviewerChange = useCallback((submissionId: string) => {
    if (activeReviewId !== submissionId) {
      const sortArray = review?.find(item => item.reviewId === submissionId)
      if (sortArray) {
        setActiveReviewId(sortArray.reviewId)
      }
    }
  }, [review, activeReviewId])

  const dashboardLoading = useMemo(() => (
    isLoadingDeadlineStatus ?? isLoadingSubmissionPossibility ?? isLoadingSubmissionId ?? isLoadingSubmission ?? isLoadingReview
  ), [isLoadingDeadlineStatus, isLoadingSubmissionPossibility, isLoadingSubmissionId, isLoadingSubmission, isLoadingReview])

  const activeReview = useMemo(() => {
    if (review && review.length > 0) {
      return review.find(item => item.reviewId === activeReviewId)
    }
  }, [review, activeReviewId])

  const reviewCatalog = useMemo((): IWorkItem[] | undefined => {
    if (review && review.length > 0) {
      return review.map(item => ({
        submissionId: item.reviewId,
        studentName: item.reviewer === IRole.teacher ? `${item.reviewerName} (преподаватель)` : item.reviewer === IRole.student ? `${item.reviewerName} (пир)` : item.reviewerName
      }))
    }
  }, [review])

  return (
    <DashboardWorkBox
      isLoading={dashboardLoading}
      error={error}
    >
      {submissionDeadlineStatus && submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED && submission && submission.answers.length > 0 && (
        <>
          {review && review.length > 0 && activeReview && activeReviewId && reviewCatalog && (
            <Grid container
              spacing={{ xs: "5px", md: "10px", lg: "25px" }}
              direction={matches ? 'row' : 'row-reverse'}
            >
              <Grid item xs={12} md={2} >
                <WorksList
                  worksCatalog={reviewCatalog}
                  onWorkChange={handleReviewerChange}
                  activeWorkId={activeReviewId}
                />
              </Grid>

              <Grid item xs={12} md={10}>
                <Grid container xs={12}
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
                        variant={"h6"}
                        color={"#273AB5"}
                      >
                        {"Мои ответы:"}
                      </Typography>
                    </Box>

                    <Box
                      maxHeight={!matches ? "calc(100vh - 205px)" : "100%"}
                      sx={styles.formWrapper}
                    >
                      <VisibleForm
                        form={{ responses: submission.answers }}
                        answerBoxColor={palette.fill.success}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      display={'flex'}
                      height={'40px'}
                      alignItems={'center'}
                      mb={!matches ? "20px" : "10px"}
                    >
                      <Typography
                        variant={"h6"}
                        color={"#273AB5"}
                      >
                        {`Результаты проверок (${activeReview.reviewerName}, оценка ${activeReview.finalGrade}):`}
                      </Typography>
                    </Box>

                    <Box
                      maxHeight={!matches ? "calc(100vh - 205px)" : "100%"}
                      sx={styles.formWrapper}
                    >
                      <VisibleForm
                        form={{ responses: activeReview.answers }}
                        answerBoxColor={palette.fill.success}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {(review && review.length === 0 || !review || review === null) && !activeReview && !activeReviewId && !reviewCatalog && (
            <Box
              pb={"15px"}
              boxSizing={"border-box"}
            >
              <VisibleForm
                form={{ responses: submission.answers }}
                answerBoxColor={palette.fill.success}
              />
            </Box>
          )}
        </>
      )}

      {submissionDeadlineStatus === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ ограничен"} />
      )}

      {submissionDeadlineStatus && submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED && (!submission || submission.answers.length === 0) && submissionPossibility === ISubmissionStatus.NOT_COMPLETED && (
        <NoData label={"Вашу работу не нашли"} />
      )}
    </DashboardWorkBox>
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