import { FC, useCallback, useEffect, useState } from "react";
import { Theme, Box } from "@mui/material";
import { SxProps } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { fetchStudentWork } from "../../../../../store/checkings";
import { fetchStudentList } from "../../../../../store/checkings/thunks/fetchStudentList";
import { StudentWork } from "./StudentForm";
import { StudentsListSelect } from "./StudentsList";

import * as globalStyles from "../../../../../const/styles"
import { fetchPeerForm } from "../../../../../store/checkings/thunks/fetchPeerForm";
import { CheckingsForm } from "./CheckingForm";
import { IPeerForm, IQuestionTypes } from "../../../../../store/types";

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const statusList = useAppSelector(state => state.checkings.isListLoading)
  const lockList = useAppSelector(state => state.checkings.isListLock)
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
      dispatch(fetchStudentList(path.taskId))
      dispatch(fetchPeerForm(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (peerForm && peerForm.length > 0) {
      setResponses(JSON.parse(JSON.stringify(peerForm)))
    }
  }, [peerForm, setResponses])

  const getStudentWork = useCallback((studentId: string) => {
    if (path && path.taskId)
      dispatch(fetchStudentWork(path.taskId, studentId))
  }, [path])

  useEffect(() => {
    if (!currentStudent && studentList && studentList.length > 0 && currentStudent !== studentList[0].id) {
      setCurrentStudent(studentList[0].id)
      getStudentWork(studentList[0].id)
    }
  }, [peerForm])

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

  const handleOnFormEdit = useCallback((value: string | number, questionId: string) => {
    console.log(questionId, value)
    if (responses && responses.length > 0) {
      const filtered = responses.map(item => {
        if (item.id !== questionId) return item
        if (item.type === IQuestionTypes.SELECT_RATE && typeof value === 'number')
          return { ...item, response: value }
        if (item.type !== IQuestionTypes.SELECT_RATE && typeof value === 'string')
          return { ...item, response: value }
      })
      if (filtered && filtered.length > 0) setResponses(JSON.parse(JSON.stringify(filtered)))
    }
  }, [responses])

  return (
    <DashboardWorkBox
      isLoading={statusList}
      isLock={lockList}
      error={error}
    >
      {studentList && studentList.length > 0 && currentStudent ? (
        <Box sx={styles.container}>
          <StudentsListSelect
            selectedStudentId={currentStudent}
            studentsList={studentList}
            onStudentChange={handleStudentChange}
          />

          <Box sx={styles.formWrapper}>
            <Box sx={styles.formContainer}>
              <DashboardWorkBox
                isLoading={statusStudentWork}
                isLock={lockStudentWork}
                error={error}
              >
                {studentWork && studentWork.length > 0 && (
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
                    onResponseeEdit={handleOnFormEdit}
                  />
                )}
              </DashboardWorkBox>
            </Box>
          </Box>
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