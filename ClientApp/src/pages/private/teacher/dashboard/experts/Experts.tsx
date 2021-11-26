
import { FC, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { fetchExperts, deleteExpert } from "../../../../../store/experts";

import { IExtpertItem } from "../../../../../store/types";
import { ExpertsTable } from "./ExpertsTable";


export const Experts: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.experts.isLoading)
  const error = useAppSelector(state => state.experts.error)
  const experts = useAppSelector(state => state.experts.payload)

  useEffect(() => {
    console.log(path)
    if (path && path.taskId)
      dispatch(fetchExperts(path.taskId))
  }, [])

  const handleRemove = useCallback((expertEmail: string) => {
    if (path && path.taskId)
      dispatch(deleteExpert(path.taskId, expertEmail))
  }, [path])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      <ExpertsTable experts={experts ?? []} onRemove={handleRemove} />
    </DashboardWorkBox>
  )
}

const fakeData = [
  {
    email: "mayusupov@miem.hse.ru",
    name: "Мухаммад Юсупов",
    taskComplete: 5,
    assignedTasks: 10
  },
  {
    email: "iivanov@miem.hse.ru",
    name: "Иван Иванов",
    taskComplete: 5,
    assignedTasks: 10
  },
  {
    email: "vpupkin@miem.hse.ru",
    name: "Вася Пупкин",
    taskComplete: 10,
    assignedTasks: 10
  },
] as Array<IExtpertItem>