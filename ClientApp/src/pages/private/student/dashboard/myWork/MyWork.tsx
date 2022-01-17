import { FC, useCallback, useEffect, useState } from "react";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { AccessTime } from "../../../../../components/assessTime";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { NoData } from "../../../../../components/noData";

import { fetchWorkSubmissionStatus } from "../../../../../store/authorformStudent";
import { fetchReviewStatus, fetchSubmissionStatus } from "../../../../../store/deadlineStatus";
import { fetchMyWork, fetchReviews } from "../../../../../store/myWork";
import { DeadlineStatus, IMyWorkReviewsItem, IRole, ISubmissionStatus } from "../../../../../store/types";

import { MyWorkForm } from "./MyWorkForm";
import { ReviewsList } from "./ReviewsList";

import { palette } from "../../../../../theme/colors";
import * as globalStyles from "../../../../../const/styles"


export const MyWork: FC = () => {
  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const submissionWorkStatus = useAppSelector(state => state.authorForm.isLoading)
  const submissionWorkPayload = useAppSelector(state => state.authorForm.submissionWorkStatus)
  const submissionWorkError = useAppSelector(state => state.authorForm.error)
  const submissionStatus = useAppSelector(state => state.deadlineStatus.isLoading)
  const submissionError = useAppSelector(state => state.deadlineStatus.error)
  const submissionPayload = useAppSelector(state => state.deadlineStatus.submissionStatus)
  const reviewPayload = useAppSelector(state => state.deadlineStatus.reviewStatus)
  const myWorkStatus = useAppSelector(state => state.myWork.isLoading)
  const myWorkError = useAppSelector(state => state.myWork.error)
  const myWorkPayload = useAppSelector(state => state.myWork.payload)
  const myWorkReview = useAppSelector(state => state.myWork.reviews)

  const [currentReview, setCurrentReview] = useState<IMyWorkReviewsItem>()

  useEffect(() => {
    if (path && path.taskId) {
      console.log("Checking submission deadlines")
      dispatch(fetchSubmissionStatus(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (path && path.taskId && submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED) {
      console.log("Checking work complition")
      dispatch(fetchWorkSubmissionStatus(path.taskId))
    }
  }, [submissionPayload])

  useEffect(() => {
    if (path && path.taskId && submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED && submissionWorkPayload === ISubmissionStatus.COMPLETED) {
      console.log("Getting work")
      dispatch(fetchMyWork(path.taskId))
    }
  }, [submissionPayload, submissionWorkPayload])

  useEffect(() => {
    const validState = submissionPayload === DeadlineStatus.END && submissionWorkPayload === ISubmissionStatus.COMPLETED
    const foundMyWork = myWorkPayload && myWorkPayload.answers.length > 0

    if (path && path.taskId && validState && foundMyWork) {
      console.log("Getting reviews deadlines")
      dispatch(fetchReviewStatus(path.taskId))
    }
  }, [myWorkPayload])

  useEffect(() => {
    const validState = submissionPayload === DeadlineStatus.END && submissionWorkPayload === ISubmissionStatus.COMPLETED && reviewPayload && reviewPayload !== DeadlineStatus.NOT_STARTED
    const foundMyWork = myWorkPayload && myWorkPayload.answers.length > 0

    if (path && path.taskId && validState && foundMyWork) {
      console.log("Getting reviews work")
      dispatch(fetchReviews(path.taskId))
    }
  }, [reviewPayload])

  useEffect(() => {
    if (myWorkReview && myWorkReview.length > 0 && !currentReview) {
      setCurrentReview(myWorkReview[0])
    }
  }, [myWorkReview])

  const mainStatus = submissionStatus ? submissionStatus : (submissionWorkStatus ? submissionWorkStatus : myWorkStatus)
  const mainError = submissionError ? submissionError : (submissionWorkError ? submissionWorkError : myWorkError)

  const submissionDeadlineInvalid = submissionPayload && submissionPayload === DeadlineStatus.NOT_STARTED
  const submissionDeadlineValid = submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED

  const workNotFound = submissionDeadlineValid && submissionWorkPayload === ISubmissionStatus.NOT_COMPLETED
  const workFound = submissionWorkPayload === ISubmissionStatus.COMPLETED

  const reviewDeadlineInvalid = reviewPayload && reviewPayload === DeadlineStatus.NOT_STARTED
  const reviewDeadlineValid = reviewPayload && reviewPayload !== DeadlineStatus.NOT_STARTED

  const reviewsNotFound = (myWorkReview && myWorkReview.length === 0) || (submissionPayload !== DeadlineStatus.END)

  const reviewsList = myWorkReview?.map(item => {
    if (item.reviewer === IRole.teacher) return {
      submissionId: item.reviewId,
      studentName: `${item.reviewerName} - Преподаватель`
    }

    if (item.reviewer === IRole.student) return {
      submissionId: item.reviewId,
      studentName: `${item.reviewerName} - Пир`
    }

    return {
      submissionId: item.reviewId,
      studentName: item.reviewerName,
    }
  })

  const handleReviewerChange = useCallback((submissionId: string) => {
    console.log(currentReview)
    const sortArray = myWorkReview?.filter(item => item.reviewId === submissionId)
    if (sortArray && sortArray.length > 0) {
      setCurrentReview(JSON.parse(JSON.stringify(sortArray[0])))
    }
  }, [setCurrentReview, myWorkReview, currentReview])

  return (
    <DashboardWorkBox
      isLoading={mainStatus}
      error={mainError}
    >
      {myWorkPayload && myWorkPayload.answers && myWorkPayload.answers.length > 0 && workFound && (reviewDeadlineInvalid || reviewsNotFound) && (
        <>
          <MyWorkForm
            myWork={myWorkPayload}
            answerBoxColor={palette.fill.success}
          />
        </>
      )}

      {myWorkPayload && myWorkPayload.answers && myWorkPayload.answers.length > 0 && workFound &&
        reviewDeadlineValid && myWorkReview && myWorkReview.length > 0 && currentReview &&
        reviewsList && reviewsList.length > 0 &&
        (
          <Box sx={styles.container}>
            <ReviewsList
              selectedReviewId={currentReview.reviewId}
              reviewsList={reviewsList}
              onReviewerChange={handleReviewerChange}
            />

            <Box sx={styles.formWrapper}>
              <Box sx={styles.formContainer}>
                <Typography
                  variant={"h6"}
                  sx={styles.subTitle}
                >
                  {"Мои ответы:"}
                </Typography>

                <MyWorkForm
                  myWork={myWorkPayload}
                  answerBoxColor={palette.fill.success} /
                >
              </Box>

              <Box sx={styles.formContainer}>
                <Typography
                  variant={"h6"}
                  sx={styles.subTitle}
                >
                  {`Результаты проверок (${currentReview.reviewerName}, оценка - ${currentReview.finalGrade}):`}
                </Typography>

                <MyWorkForm
                  myWork={currentReview}
                  answerBoxColor={palette.fill.info}
                />
              </Box>
            </Box>
          </Box>
        )
      }

      {submissionDeadlineInvalid && (
        <AccessTime label={"Доступ ограничен"} />
      )}

      {workNotFound && (
        <>
          <NoData label={"Вашу работу не нашли"} />
        </>
      )}
    </DashboardWorkBox>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "10px"
  } as SxProps<Theme>,
  listContainer: {
    display: "flex",
    gap: "5px"
  } as SxProps<Theme>,
  formWrapper: {
    display: "flex",
    gap: "10px",
    '@media (max-width: 900px)': {
      flexDirection: "column",
      gap: "0px",
    }
  } as SxProps<Theme>,
  formContainer: {
    flex: "0 1 50%",
    maxHeight: "calc(100vh - 183px - 70px)",
    overflowY: "auto",
    ...globalStyles.scrollStyles,
    '@media (max-width: 900px)': {
      flex: "0 0 100%",
      maxHeight: "unset",
    }
  } as SxProps<Theme>,
  subTitle: {
    color: "#5A7180",
    margin: "15px 0px 7px 0px",
  } as SxProps<Theme>,
  errorDeadlineContainer: {
    margin: "50px 0px 0px 0px",
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: "10px",
    flexDirection: "column",
    color: "#A4ADC8",
    fontSize: "58px"
  } as SxProps<Theme>,
}