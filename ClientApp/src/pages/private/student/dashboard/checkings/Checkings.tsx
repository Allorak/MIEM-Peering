
import React from "react";
import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box, Typography, Tooltip, IconButton, Slide } from "@mui/material";
import { SxProps } from "@mui/system";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { TransitionProps } from "@mui/material/transitions";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { Popup } from "../../../../../components/popup";

import { actions, createReview, fetchStudentWork, fetchCheckingsWorkList, fetchPeerForm, fetchReviews } from "../../../../../store/checkings";
import { fetchReviewStatus } from "../../../../../store/deadlineStatus";

import { StudentWork } from "./StudentForm";
import { StudentsListSelect } from "./StudentsList";
import { CheckingsForm } from "./CheckingForm";

import { DeadlineStatus, IPeerForm, IPeerResponses, IQuestionTypes } from "../../../../../store/types";

import { palette } from "../../../../../theme/colors";
import * as globalStyles from "../../../../../const/styles"


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathStDashboard()

  const statusDeadline = useAppSelector(state => state.deadlineStatus.isLoading)
  const reviewStatus = useAppSelector(state => state.deadlineStatus.reviewStatus)
  const reviewError = useAppSelector(state => state.deadlineStatus.error)

  const statusList = useAppSelector(state => state.checkings.isListLoading)
  const studentList = useAppSelector(state => state.checkings.studentList)

  const myReviews = useAppSelector(state => state.checkings.myReviews)
  const myReviewsList = myReviews?.map(item => ({ submissionId: item.submissionId, studentName: item.studentName }))

  const statusStudentWork = useAppSelector(state => state.checkings.isWorkLoading)
  const studentWork = useAppSelector(state => state.checkings.studentWork)

  const statusPeerForm = useAppSelector(state => state.checkings.isPeerFormLoading)
  const peerForm = useAppSelector(state => state.checkings.peerForm)

  const error = useAppSelector(state => state.checkings.error)
  const statusReviewAdd = useAppSelector(state => state.checkings.isAddReviewLoading)

  const [currentWorkId, setCurrentWorkIdStudent] = useState<string | undefined>()
  const [currentReviewId, setCurrentReviewId] = useState<string | undefined>()
  const [responses, setResponses] = useState<IPeerForm>()
  const [popupStatus, setPopupStatus] = useState<boolean>(false)

  useEffect(() => {
    if (path && path.taskId) {
      console.log("Get review deadlines...")
      dispatch(fetchReviewStatus(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (path && path.taskId && reviewStatus === DeadlineStatus.START) {
      console.log("Get work list for review...")
      dispatch(actions.reset())
      dispatch(fetchCheckingsWorkList(path.taskId))
    }
  }, [reviewStatus])

  useEffect(() => {
    const flag = reviewStatus === DeadlineStatus.START && studentList && studentList.length > 0
    if (path && path.taskId && flag) {
      console.log("Get Peer Form for review...")
      dispatch(fetchPeerForm(path.taskId))
      setCurrentWorkIdStudent(studentList[0].submissionId)
      getStudentWork(studentList[0].submissionId)
    }
  }, [studentList])

  useEffect(() => {
    const flag = reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED && ((!studentList && reviewStatus !== DeadlineStatus.START) || (studentList && studentList.length === 0 && reviewStatus !== DeadlineStatus.END))
    if (path && path.taskId && flag) {
      console.log("Get My Reviews...")
      dispatch(fetchReviews(path.taskId))
    }
  }, [studentList, reviewStatus])

  useEffect(() => {
    const flag = reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED && myReviews && myReviews.length > 0 && !currentMyReview
    if (path && path.taskId && flag) {
      setCurrentReviewId(myReviews[0].submissionId)
    }
  }, [myReviews])

  useEffect(() => {
    if (peerForm && peerForm.rubrics && peerForm.rubrics.length > 0) {
      setResponses(JSON.parse(JSON.stringify(peerForm)))
    }
  }, [peerForm])

  const getStudentWork = useCallback((workId: string) => {
    if (path && path.taskId) {
      console.log("Get Author Work for review...")
      dispatch(fetchStudentWork(path.taskId, workId))
    }
  }, [path])

  const handleStudentChange = useCallback((studentId: string) => {
    setCurrentWorkIdStudent(studentId)
    getStudentWork(studentId)
    if (path && path.taskId) {
      setResponses(undefined)
      dispatch(fetchPeerForm(path.taskId))
    }
  }, [])

  const handleReviewChange = useCallback((submissionId: string) => {
    setCurrentReviewId(submissionId)
  }, [])

  const handleOnFormEdit = useCallback((value: string | number | undefined, questionId: string) => {
    setResponses(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: JSON.parse(JSON.stringify(prev.rubrics.map(item => {
            if (item.id !== questionId) return item
            if (item.type === IQuestionTypes.SELECT_RATE && (typeof value === 'number' || typeof value === 'undefined'))
              return { ...item, response: value }
            if (item.type !== IQuestionTypes.SELECT_RATE && (typeof value === 'string' || typeof value === 'undefined'))
              return { ...item, response: value }
          })))
        }
      }
    })
  }, [responses])

  const handleOnViewClick = useCallback(() => {
    console.log(path && path.taskId && currentReviewId)
    if (path && path.taskId && currentReviewId) {
      setPopupStatus(true)
      console.log("currentReviewId:", currentReviewId)
      getStudentWork(currentReviewId)
    }
  }, [currentReviewId])

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (path && path.taskId && currentWorkId && formResponses.responses)
      dispatch(createReview(path.taskId, currentWorkId, formResponses))
  }, [currentWorkId, path])

  const status = reviewStatus ? statusList : statusDeadline
  const mainError = reviewStatus ? error : reviewError

  const validDeadline = reviewStatus === DeadlineStatus.START
  const invalidDeadline = reviewStatus && reviewStatus === DeadlineStatus.NOT_STARTED

  const validVisibleDeadline = reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED

  const myReviewsInvalid = myReviews && myReviews.length === 0

  const currentMyReview = myReviews && myReviews.length > 0 && currentReviewId ? myReviews.filter(item => item.submissionId === currentReviewId) : undefined

  const currentAnswers = currentMyReview && currentMyReview.length > 0 ? { responses: currentMyReview[0].answers } : undefined
  const currentExpertAnswers = currentMyReview && currentMyReview.length > 0 && currentMyReview[0].expertAnswers && currentMyReview[0].expertAnswers.length > 0 ?
    {
      responses: currentMyReview[0].expertAnswers
    } : undefined

  const currentReviewAuthor = currentMyReview && currentMyReview.length > 0 ? currentMyReview[0].studentName : undefined

  return (
    <DashboardWorkBox
      isLoading={status}
      error={mainError}
    >
      {(invalidDeadline || myReviewsInvalid) && (
        <AccessTime label={"Досутп ограничен"} />
      )}

      {studentList && studentList.length > 0 && currentWorkId && validDeadline && (
        <Box sx={styles.container}>
          <StudentsListSelect
            selectedStudentId={currentWorkId}
            studentsList={studentList}
            onStudentChange={handleStudentChange}
          />
          <DashboardWorkBox
            isLoading={statusReviewAdd}
            error={error}
          >
            <Box sx={styles.formWrapper}>
              <Box sx={styles.formContainer}>
                <DashboardWorkBox
                  isLoading={statusStudentWork}
                  error={error}
                >
                  {studentWork && studentWork.responses && studentWork.responses.length > 0 && (
                    <>
                      <Typography
                        variant={"h6"}
                        sx={styles.subTitle}
                      >
                        {"Форма с ответами:"}
                      </Typography>
                      <StudentWork
                        studentWork={studentWork}
                        answerBoxColor={palette.fill.secondary}
                      />
                    </>
                  )}
                </DashboardWorkBox>
              </Box>

              <Box sx={styles.formContainer}>
                <DashboardWorkBox
                  isLoading={statusPeerForm}
                  error={error}
                >
                  {responses && responses.rubrics && responses.rubrics.length > 0 && (
                    <>
                      <Typography
                        variant={"h6"}
                        sx={styles.subTitle}
                      >
                        {"Форма для оценивания:"}
                      </Typography>
                      <CheckingsForm
                        peerForm={responses}
                        onSubmit={onRequest}
                        onEdit={handleOnFormEdit}
                      />
                    </>
                  )}
                </DashboardWorkBox>
              </Box>
            </Box>
          </DashboardWorkBox>
        </Box>
      )}

      {(studentList && studentList.length === 0 || reviewStatus === DeadlineStatus.END) && validVisibleDeadline && myReviews && myReviews.length > 0 && currentReviewId &&
        myReviewsList && myReviewsList.length > 0 && currentAnswers &&
        (
          <Box sx={styles.container}>

            <Box sx={styles.selectHeaderContainer}>
              <Box sx={styles.selectComponent}>
                <StudentsListSelect
                  selectedStudentId={currentReviewId}
                  studentsList={myReviewsList}
                  onStudentChange={handleReviewChange}
                />
              </Box>
              <Tooltip
                title={"Просмотр работы"}
                placement={"top"}
              >
                <IconButton
                  color="primary"
                  size={"large"}
                  onClick={() => handleOnViewClick()}
                >
                  <VisibilityOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={styles.formWrapper}>
              <Box sx={currentExpertAnswers ? styles.formContainer : { ...styles.formContainer, flex: "0 1 100%" }}>
                <Typography
                  variant={"h6"}
                  sx={styles.subTitle}
                >
                  {"Результаты Вашей проверки:"}
                </Typography>

                <StudentWork
                  studentWork={currentAnswers}
                  answerBoxColor={palette.fill.success}
                />
              </Box>

              {currentExpertAnswers && (
                <Box sx={styles.formContainer}>
                  <Typography
                    variant={"h6"}
                    sx={styles.subTitle}
                  >
                    {"Результаты экспертной проверки:"}
                  </Typography>

                  <StudentWork
                    studentWork={currentExpertAnswers}
                    answerBoxColor={palette.fill.info}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}

      {currentMyReview && currentReviewAuthor && (
        <Popup
          title={`Работа студента: ${currentReviewAuthor}`}
          open={popupStatus}
          loading={statusStudentWork}
          onCloseHandler={setPopupStatus}
          fullScreen
          fullWidth
          PaperProps={{ sx: { flex: '0 1 100%' } }}
          dialogContentSx={{ padding: "0px 10px", ...globalStyles.scrollStyles, backgroundColor: "#F5F7FD" }}
          TransitionComponent={Transition}
          transitionDuration={100}
        >
          {studentWork && (
            <Box sx={styles.popupContainer}>
              <Typography
                variant={"h6"}
                sx={styles.subTitle}
              >
                {"Ответы:"}
              </Typography>

              <StudentWork
                studentWork={studentWork}
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
  selectHeaderContainer: {
    display: 'flex',
    width: "100%",
    alignItems: "center"
  } as SxProps<Theme>,
  selectComponent: {
    flex: "0 1 100%"
  } as SxProps<Theme>,
  popupContainer: {
    maxWidth: "1400px",
    margin: "0 auto"
  } as SxProps<Theme>,
}