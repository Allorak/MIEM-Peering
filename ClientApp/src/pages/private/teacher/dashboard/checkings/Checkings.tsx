import { Box } from "@mui/system";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { fetchStudentList } from "../../../../../store/checkings/thunks/fetchStudentList";
import { ICatalog } from "../../../../../store/types";
import { StudentWork } from "./StudentForm";
import { StudentsListSelect } from "./StudentsList";

export const Checkings: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.checkings.isLoading)
  const error = useAppSelector(state => state.checkings.error)

  const studentList = useAppSelector(state => state.checkings.studentList)

  const [currentStudent, setCurrentStudent] = useState<string | undefined>()

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchStudentList(path.taskId))
  }, [path])

  useEffect(() => {
    if (!currentStudent && studentList && studentList.length > 0)
      setCurrentStudent(studentList[0].id)
  }, [studentList])

  const handleStudentChange = useCallback((studentId: string) => {
    if (currentStudent !== studentId)
      setCurrentStudent(studentId)
  }, [currentStudent, setCurrentStudent])

  return (
    <>
      {studentList && studentList.length > 0 && currentStudent ? (
        <Box>
          <Box>
            <StudentsListSelect
              selectedStudentId={currentStudent}
              studentsList={studentList}
              onStudentChange={handleStudentChange}
            />
          </Box>

          <Box>
            <Box>
              <StudentWork studentId={currentStudent} />
            </Box>
          </Box>
        </Box>

      ) : (
        <></>
      )}
    </>
  )
}