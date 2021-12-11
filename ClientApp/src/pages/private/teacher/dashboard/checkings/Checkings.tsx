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

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const statusList = useAppSelector(state => state.checkings.isListLoading)
  const lockList = useAppSelector(state => state.checkings.isListLock)
  const statusStudentWork = useAppSelector(state => state.checkings.isWorkLoading)
  const lockStudentWork = useAppSelector(state => state.checkings.isListLoading)
  const error = useAppSelector(state => state.checkings.error)

  const studentList = useAppSelector(state => state.checkings.studentList)
  const studentWork = useAppSelector(state => state.checkings.studentWork)

  const [currentStudent, setCurrentStudent] = useState<string | undefined>()

  useEffect(() => {
    if (path && path.taskId) {
      dispatch(fetchStudentList(path.taskId))
    }
    console.log("!")
  }, [])

  useEffect(() => {
    if (!currentStudent && studentList && studentList.length > 0 && currentStudent !== studentList[0].id) {
      setCurrentStudent(studentList[0].id)
      getStudentWork(studentList[0].id)
    }
  }, [studentList])

  const handleStudentChange = useCallback((studentId: string) => {
    console.log(currentStudent !== studentId)
    if (currentStudent !== studentId) {
      setCurrentStudent(studentId)
      getStudentWork(studentId)
    }
  }, [])

  const getStudentWork = useCallback((studentId: string) => {
    if (path && path.taskId)
      dispatch(fetchStudentWork(path.taskId, studentId))
  }, [path])

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
              <Box sx={{ height: "530px", backgroundColor: "pink" }}></Box>

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