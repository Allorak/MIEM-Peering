import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { NoData } from "../../../../../components/noData";

import { actions, createReview, fetchStudentWork, fetchCheckingsWorkList, fetchPeerForm } from "../../../../../store/checkings";
import { fetchReviewStatus } from "../../../../../store/deadlineStatus";

import { StudentWork } from "./StudentForm";
import { StudentsListSelect } from "./StudentsList";
import { CheckingsForm } from "./CheckingForm";

import { DeadlineStatus, IPeerForm, IPeerResponses, IQuestionTypes } from "../../../../../store/types";

import { palette } from "../../../../../theme/colors";
import * as globalStyles from "../../../../../const/styles"

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathExDashboard()

  const statusDeadline = useAppSelector(state => state.deadlineStatus.isLoading)
  const reviewStatus = useAppSelector(state => state.deadlineStatus.reviewStatus)
  const submissionError = useAppSelector(state => state.deadlineStatus.error)
  const statusList = useAppSelector(state => state.checkings.isListLoading)
  const statusReview = useAppSelector(state => state.checkings.isAddReviewLoading)
  const lockReview = useAppSelector(state => state.checkings.isAddReviewLock)
  const statusStudentWork = useAppSelector(state => state.checkings.isWorkLoading)
  const lockStudentWork = useAppSelector(state => state.checkings.isListLoading)
  const statusPeerForm = useAppSelector(state => state.checkings.isPeerFormLoading)
  const lockPeerForm = useAppSelector(state => state.checkings.isPeerFormLock)
  const error = useAppSelector(state => state.checkings.error)

  const studentList = useAppSelector(state => state.checkings.studentList)
  const studentWork = useAppSelector(state => state.checkings.studentWork)
  const peerForm = useAppSelector(state => state.checkings.peerForm)

  const [currentWorkId, setCurrentWorkIdStudent] = useState<string | undefined>()
  const [responses, setResponses] = useState<IPeerForm>()

  useEffect(() => {
    if (path && path.taskId && reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED) {
      console.log("Getting Works...")
      dispatch(actions.reset())
      dispatch(fetchCheckingsWorkList(path.taskId))
      dispatch(fetchPeerForm(path.taskId))
    }
  }, [reviewStatus])

  useEffect(() => {
    if (path && path.taskId) {
      console.log("Getting Deadlines...")
      dispatch(fetchReviewStatus(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (peerForm && peerForm.rubrics && peerForm.rubrics.length > 0) {
      setResponses(JSON.parse(JSON.stringify(peerForm)))
    }
  }, [peerForm])

  const getStudentWork = useCallback((workId: string) => {
    if (path && path.taskId)
      dispatch(fetchStudentWork(path.taskId, workId))
  }, [path])

  useEffect(() => {
    const flag = reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED && studentList && studentList.length > 0
    if (path && path.taskId && flag) {
      console.log("Get Peer Form for review...")
      dispatch(fetchPeerForm(path.taskId))
      setCurrentWorkIdStudent(studentList[0].submissionId)
      getStudentWork(studentList[0].submissionId)
    }
  }, [studentList, reviewStatus])

  const handleStudentChange = useCallback((studentId: string) => {
    setCurrentWorkIdStudent(studentId)
    getStudentWork(studentId)
    if (path && path.taskId) {
      setResponses(undefined)
      dispatch(fetchPeerForm(path.taskId))
    }
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

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (path && path.taskId && currentWorkId && formResponses.responses)
      dispatch(createReview(path.taskId, currentWorkId, formResponses))
  }, [currentWorkId, path])

  const status = reviewStatus ? statusList : statusDeadline
  const mainError = reviewStatus ? error : submissionError

  return (
    <DashboardWorkBox
      isLoading={status}
      error={mainError}
    >
      {reviewStatus && reviewStatus === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ закрыт"} />
      )}

      {studentList && studentList.length > 0 && currentWorkId && (
        <Box sx={styles.container}>
          <StudentsListSelect
            selectedStudentId={currentWorkId}
            studentsList={studentList}
            onStudentChange={handleStudentChange}
          />
          <DashboardWorkBox
            isLoading={statusReview}
            isLock={lockReview}
            error={error}
          >
            <Box sx={styles.formWrapper}>
              <Box sx={styles.formContainer}>
                <DashboardWorkBox
                  isLoading={statusStudentWork}
                  isLock={lockStudentWork}
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
                        answerBoxColor={palette.fill.success}
                      />
                    </>
                  )}
                </DashboardWorkBox>
              </Box>

              <Box sx={styles.formContainer}>
                <DashboardWorkBox
                  isLoading={statusPeerForm}
                  isLock={lockPeerForm}
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

      {studentList && studentList.length === 0 && reviewStatus && reviewStatus !== DeadlineStatus.NOT_STARTED && (
        <NoData label={"Работы для проверки не найдены"} />
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
    margin: "15px 0px 7px 0px"
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