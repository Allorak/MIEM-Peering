import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { actions, createReview, fetchStudentWork } from "../../../../../store/checkings";
import { fetchStudentList } from "../../../../../store/checkings/thunks/fetchStudentList";
import { fetchPeerForm } from "../../../../../store/checkings/thunks/fetchPeerForm";

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

  const [currentStudent, setCurrentStudent] = useState<string | undefined>()
  const [responses, setResponses] = useState<IPeerForm>()

  useEffect(() => {
    if (path && path.taskId) {
      dispatch(actions.reset())
      dispatch(fetchStudentList(path.taskId))
      dispatch(fetchPeerForm(path.taskId))
    }
  }, [])

  useEffect(() => {
    console.log("Responses:", responses)
  }, [responses])

  useEffect(() => {
    if (peerForm && peerForm.length > 0) {
      setResponses(JSON.parse(JSON.stringify(peerForm)))
    }
  }, [peerForm])

  const getStudentWork = useCallback((studentId: string) => {
    if (path && path.taskId)
      dispatch(fetchStudentWork(path.taskId, studentId))
  }, [path])

  useEffect(() => {
    if (studentList && studentList.students && studentList.students.length > 0) {
      setCurrentStudent(studentList.students[0].id)
      getStudentWork(studentList.students[0].id)
    }
  }, [studentList])

  const handleStudentChange = useCallback((studentId: string) => {
    if (currentStudent !== studentId) {
      setCurrentStudent(studentId)
      getStudentWork(studentId)
      if (path && path.taskId) {
        setResponses(undefined)
        dispatch(fetchPeerForm(path.taskId))
      }
    }
  }, [])

  const handleOnFormEdit = useCallback((value: string | number | undefined, questionId: string) => {
    setResponses(prev => {
      if (prev && prev.length > 0) {
        return JSON.parse(JSON.stringify(prev.map(item => {
          if (item.id !== questionId) return item
          if (item.type === IQuestionTypes.SELECT_RATE && (typeof value === 'number' || typeof value === 'undefined'))
            return { ...item, response: value }
          if (item.type !== IQuestionTypes.SELECT_RATE && (typeof value === 'string' || typeof value === 'undefined'))
            return { ...item, response: value }
        })))
      }
    })
  }, [responses])

  const onRequest = useCallback((formResponses: IPeerResponses) => {
    if (path && path.taskId && currentStudent && formResponses.responses)
      dispatch(createReview(path.taskId, currentStudent, formResponses))
  }, [currentStudent, path])

  return (
    <DashboardWorkBox
      isLoading={statusList}
      isLock={lockList}
      error={error}
    >
      {studentList && studentList.students && studentList.students.length > 0 && currentStudent ? (
        <Box sx={styles.container}>
          <StudentsListSelect
            selectedStudentId={currentStudent}
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
                    <StudentWork studentWork={studentWork} />
                  )}
                </DashboardWorkBox>
              </Box>

              <Box sx={styles.formContainer}>
                <DashboardWorkBox
                  isLoading={statusPeerForm}
                  isLock={lockPeerForm}
                  error={error}
                >
                  {responses && responses.length > 0 && (
                    <CheckingsForm
                      peerForm={responses}
                      onSubmit={onRequest}
                      onEdit={handleOnFormEdit}
                    />
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
  } as SxProps<Theme>,
  formContainer: {
    flex: "0 1 50%",
    maxHeight: "calc(100vh - 183px - 70px)",
    overflowY: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
}