
import { FC, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { ExpertsTable } from "./ExpertsTable";

import { fetchExperts } from "../../../../../store/experts";


export const Experts: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.experts.isLoading)
  const error = useAppSelector(state => state.experts.error)
  const experts = useAppSelector(state => state.experts.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchExperts(path.taskId))
  }, [])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {experts && experts.length > 0 && (
        <ExpertsTable experts={experts} />
      )}
    </DashboardWorkBox>
  )
}