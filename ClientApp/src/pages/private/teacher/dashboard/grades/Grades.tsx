import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { NoData } from "../../../../../components/noData";
import { fetchGrades } from "../../../../../store/grades";
import { GradesTable } from "./GradesTable";

export const Grades: FC = () => {
  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.grades.isLoading)
  const error = useAppSelector(state => state.grades.error)
  const grades = useAppSelector(state => state.grades.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchGrades(path.taskId))
  }, [])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {grades && grades.length > 0 && (
        <GradesTable grades={grades} />
      )}

      {grades && grades.length === 0 && (
        <NoData label={"Нет данных"} />
      )}
    </DashboardWorkBox>
  )
}