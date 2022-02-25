import React from "react";
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Box, Button, Grid, Slide, Theme, Typography, useMediaQuery } from "@mui/material"
import { SxProps } from "@mui/system"
import { TransitionProps } from "@mui/material/transitions";
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';

import { fetchReviews, fetchStudentWork } from "../../store/checkings"
import { IError, IMyReviews, IMyWorkForm, IWorkItem } from "../../store/types"

import { DashboardWorkBox } from "../dashboardWorkBox"
import { VisibleForm } from "../visibleForm"
import { WorksList } from "../workList"
import { Popup } from "../popup"

import { scrollStyles } from "../../const/styles"
import { palette } from "../../theme/colors"


interface IProps {
  taskId: string
  accessToken: string
  onReviewEmpty: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ReviewsComponent: FC<IProps> = ({
  taskId,
  accessToken,
  onReviewEmpty
}) => {
  const matches = useMediaQuery('(max-width:899px)')

  const [isLoadingReview, setLoadingReview] = useState(false)
  const [reviews, setRewiews] = useState<IMyReviews>()

  const [error, setError] = useState<IError>()

  const [activeWorkId, setActivetWorkId] = useState<string | undefined>()
  const [hasTeacherAnswer, setTeacherAnswer] = useState(false)

  const [isLoadingStudentSubmission, setLoadingStudentSubmission] = useState(false)
  const [submission, setSubmission] = useState<IMyWorkForm>()

  const [popupStatus, setPopupStatus] = useState(false)

  useEffect(() => {
    getReviews()
  }, [])

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setActivetWorkId(reviews[0].submissionId)
    }

    if (reviews && reviews.length === 0) {
      onReviewEmpty()
    }
  }, [onReviewEmpty, reviews])

  const getReviews = useCallback(() => {
    setLoadingReview(true)
    fetchReviews(taskId, accessToken).then(response => {
      if (response.success) {
        setRewiews(response.payload)
      } else {
        setError(response.error)
        setRewiews(undefined)
      }
      setLoadingReview(false)
    })
  }, [taskId, accessToken])

  const getSubmission = useCallback((workId: string) => {
    if (activeWorkId && reviews && reviews.length > 0) {
      setLoadingStudentSubmission(true)
      fetchStudentWork(taskId, workId, accessToken).then(response => {
        if (response.success) {
          setSubmission(response.payload)
        } else {
          setError(response.error)
          setSubmission(undefined)
        }
        setLoadingStudentSubmission(false)
      })
    }
  }, [taskId, accessToken, reviews, activeWorkId])

  const handleOnSubmissionChange = useCallback((submissionId: string) => {
    if (submissionId !== activeWorkId) {
      setActivetWorkId(submissionId)
    }
  }, [activeWorkId])

  const handleOnOpenWork = useCallback(() => {
    if (activeWorkId && reviews && reviews.length > 0) {
      setPopupStatus(true)
      getSubmission(activeWorkId)
    }
  }, [activeWorkId, reviews])

  const myAnswers = useMemo(() => {
    if (reviews && reviews.length > 0 && activeWorkId) {
      return reviews.find(item => item.submissionId === activeWorkId)?.answers
    }
  }, [reviews, activeWorkId])

  const correctAnswers = useMemo(() => {
    if (reviews && reviews.length > 0 && activeWorkId) {
      const findCorrectAnswers = reviews.find(item => item.submissionId === activeWorkId)
      if (findCorrectAnswers) {
        if (findCorrectAnswers.teacherAnswers && findCorrectAnswers.teacherAnswers.length > 0) {
          setTeacherAnswer(true)
          return findCorrectAnswers.teacherAnswers
        }
        setTeacherAnswer(false)
        return findCorrectAnswers.expertAnswers
      }
    }
  }, [reviews, activeWorkId])

  const reviewsList = useMemo((): IWorkItem[] | undefined => {
    if (reviews && reviews.length > 0) {
      return reviews.map(item => ({ submissionId: item.submissionId, studentName: item.studentName }))
    }
  }, [reviews])

  const studentName = useMemo(() => {
    return reviewsList?.find(item => item.submissionId === activeWorkId)?.studentName
  }, [reviewsList, activeWorkId])

  return (
    <DashboardWorkBox
      isLoading={isLoadingReview}
      error={error}
    >
      {reviews && reviews.length > 0 && activeWorkId && (
        <Grid
          container
          spacing={{ xs: "5px", md: "10px", lg: "25px" }}
          direction={matches ? 'row' : 'row-reverse'}
        >
          {reviewsList && (
            <Grid item xs={12} md={2}>
              <WorksList
                worksCatalog={reviewsList}
                activeWorkId={activeWorkId}
                onWorkChange={handleOnSubmissionChange}
              />
            </Grid>
          )}

          <Grid item xs={12} md={10}>
            {studentName && (
              <Grid item xs={12}>
                <Box sx={styles.topActionBox}>
                  <Typography
                    variant={!matches ? "h5" : "h6"}
                    color={"#273AB5"}
                    sx={styles.subTitle}
                  >
                    {`Работа студента ${studentName}`}
                  </Typography>

                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<PreviewOutlinedIcon sx={{ margin: "0px -8px 0px 0px" }} />}
                    sx={styles.metaDataBt}
                    onClick={handleOnOpenWork}
                  >
                    {"Посмотреть работу"}
                  </Button>
                </Box>
              </Grid>
            )}

            {myAnswers && myAnswers.length > 0 && (
              <Grid container
                gap={!matches && correctAnswers ? { xs: "5px", md: "10px" } : 0}
                wrap={!matches ? 'nowrap' : 'wrap'}
              >
                <Grid item xs={12} md={correctAnswers && correctAnswers.length > 0 ? 6 : 12}>
                  <Typography
                    variant={!matches ? "h6" : "body1"}
                    color={"#273AB5"}
                    fontWeight={400}
                    my={"8px"}
                  >
                    {`Результаты `}
                    {<b>{"Вашей"}</b>}
                    {` проверки:`}
                  </Typography>
                  <Box
                    maxHeight={!matches ? "calc(100vh - 239px)" : "100%"}
                    sx={styles.formWrapper}
                  >
                    <VisibleForm
                      form={{ responses: myAnswers }}
                      answerBoxColor={palette.fill.info}
                    />
                  </Box>
                </Grid>

                {correctAnswers && correctAnswers.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant={"body1"}
                      fontWeight={400}
                      color={"#273AB5"}
                      my={"8px"}
                    >
                      {hasTeacherAnswer ? (
                        <>
                          {'Результаты проверки '}
                          {<b>{"Преподавателя:"}</b>}
                        </>
                      ) : (
                        <>
                          {`Результаты `}
                          <b>{"Экспертной"}</b>
                          {` проверки:`}
                        </>
                      )}
                    </Typography>
                    <Box
                      maxHeight={!matches ? "calc(100vh - 239px)" : "100%"}
                      sx={styles.formWrapper}
                    >
                      <VisibleForm
                        form={{ responses: correctAnswers }}
                        answerBoxColor={palette.fill.success}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {studentName && (
        <Popup
          title={`Работа студента ${studentName}`}
          open={popupStatus}
          loading={isLoadingStudentSubmission}
          onCloseHandler={setPopupStatus}
          fullScreen
          fullWidth
          PaperProps={{ sx: { flex: '0 1 100%' } }}
          dialogContentSx={{ padding: "0px 10px", ...scrollStyles, backgroundColor: "#F5F7FD" }}
          TransitionComponent={Transition}
          transitionDuration={100}
        >
          {submission && (
            <Box
              maxWidth={"1400px"}
              margin={"0 auto"}
              pb={"5px"}
              boxSizing={"border-box"}
            >
              <Typography
                variant={"h5"}
                color={"#273AB5"}
                my={"8px"}
              >
                {"Ответы:"}
              </Typography>

              <VisibleForm
                form={{ responses: submission.answers }}
                answerBoxColor={palette.fill.secondary}
              />
            </Box>
          )}
        </Popup>
      )}
    </DashboardWorkBox>
  )
}

const styles = {
  topActionBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0px 0px 10px 0px",
    '@media (max-width: 899px)': {
      margin: "0px 0px 5px 0px",
    }
  } as SxProps<Theme>,
  metaDataBt: {
    padding: "8px 20px",
    '@media (max-width: 899px)': {
      flex: "1 1 100%"
    }
  } as SxProps<Theme>,
  subTitle: {
    '@media (max-width: 899px)': {
      display: "none",
      opacity: 0,
      width: "0px",
      height: "0px"
    }
  } as SxProps<Theme>,
  formWrapper: {
    overflowY: 'auto',
    overflowX: 'hidden',
    pb: "5px",
    boxSizing: "border-box",
    ...scrollStyles
  } as SxProps<Theme>
}