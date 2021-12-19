
import { FC, useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { ExpertsTable } from "./ExpertsTable";

import { fetchExperts, deleteExpert } from "../../../../../store/experts";


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