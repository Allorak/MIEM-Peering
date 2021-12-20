import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { actions, createReview, fetchStudentWork, fetchCheckingsWorkList, fetchPeerForm } from "../../../../../store/checkings";

import { StudentWork } from "./StudentForm";
import { StudentsListSelect } from "./StudentsList";
import { CheckingsForm } from "./CheckingForm";

import { IPeerForm, IPeerResponses, IQuestionTypes } from "../../../../../store/types";

import * as globalStyles from "../../../../../const/styles"

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const statusList = useAppSelector(state => state.checkings.isListLoading)
  const lockList = useAppSelector(state => state.checkings.isListLock)
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
    if (path && path.taskId) {
      dispatch(actions.reset())
      dispatch(fetchCheckingsWorkList(path.taskId))
      dispatch(fetchPeerForm(path.taskId))
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
    if (studentList && studentList.length > 0) {
      setCurrentWorkIdStudent(studentList[0].workId)
      getStudentWork(studentList[0].workId)
    }
  }, [studentList])

  const handleStudentChange = useCallback((studentId: string) => {
    if (currentWorkId !== studentId) {
      setCurrentWorkIdStudent(studentId)
      getStudentWork(studentId)
      if (path && path.taskId) {
        setResponses(undefined)
        dispatch(fetchPeerForm(path.taskId))
      }
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

  return (
    <DashboardWorkBox
      isLoading={statusList}
      isLock={lockList}
      error={error}
    >
      {studentList && studentList.length > 0 && currentWorkId ? (
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
                      <StudentWork studentWork={studentWork} />
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

      ) : (
        <>{"Пусто"}</>
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
    '@media (min-width: 900px)': {
      display: "none",
      opacity: 0,
      width: "0px",
      height: "0px"
    }
  } as SxProps<Theme>,
}