import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { NoData } from "../../../../../components/noData";
import { EditableForm } from "../../../../../components/editableForm";
import { VisibleForm } from "../../../../../components/visibleForm";

import { actions, createReview, fetchStudentWork, fetchCheckingsWorkList, fetchPeerForm } from "../../../../../store/checkings";
import { fetchReviewStatus } from "../../../../../store/deadlineStatus";

import { StudentsListSelect } from "./StudentsList";

import { DeadlineStatus, IPeerForm, IPeerResponses, IQuestionTypes } from "../../../../../store/types";

import { palette } from "../../../../../theme/colors";
import * as globalStyles from "../../../../../const/styles";

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
      dispatch(actions.reset())
      dispatch(fetchCheckingsWorkList(path.taskId))
      dispatch(fetchPeerForm(path.taskId))
    }
  }, [reviewStatus])

  useEffect(() => {
    if (path && path.taskId) {
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

  const handleOnFormEdit = useCallback((value: string | number | File | undefined, questionId: string) => {
    setResponses(prev => {
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
  }, [responses])

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (path && path.taskId && currentWorkId && formResponses.answers)
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
              <Box sx={styles.formBlock}>
                <Typography
                  variant={"h6"}
                  sx={styles.subTitle}
                >
                  {"Форма с ответами:"}
                </Typography>
                <Box sx={styles.formContainer}>
                  <DashboardWorkBox
                    isLoading={statusStudentWork}
                    isLock={lockStudentWork}
                    error={error}
                  >
                    {studentWork && studentWork.responses && studentWork.responses.length > 0 && (
                      <>
                        <VisibleForm
                          form={studentWork}
                          answerBoxColor={palette.fill.success}
                        />
                      </>
                    )}
                  </DashboardWorkBox>
                </Box>
              </Box>
              <Box sx={styles.formBlock}>
                <Typography
                  variant={"h6"}
                  sx={styles.subTitle}
                >
                  {"Форма для оценивания:"}
                </Typography>
                <Box sx={styles.formContainer}>
                  <DashboardWorkBox
                    isLoading={statusPeerForm}
                    isLock={lockPeerForm}
                    error={error}
                  >
                    {responses && responses.rubrics && responses.rubrics.length > 0 && (
                      <>
                        <EditableForm
                          form={responses}
                          onSubmit={onRequest}
                          onEdit={handleOnFormEdit}
                        />
                      </>
                    )}
                  </DashboardWorkBox>
                </Box>
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
  formBlock: {
    display: "flex",
    flexDirection: 'column',
    flex: "0 1 50%"
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
    maxHeight: "calc(100vh - 90px - 125px)",
    paddingRight: "5px",
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