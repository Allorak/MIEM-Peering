import { FC, useCallback, useEffect, useState } from "react";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { NoData } from "../../../../../components/noData";
import { CheckingsComponent } from "../../../../../components/checkingsComponent";

import { fetchReviewStatus } from "../../../../../store/deadlineStatus";

import { DeadlineStatus, IError } from "../../../../../store/types";


export const Checkings: FC = () => {
  const { path } = usePrivatePathExDashboard()

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const [isLoadingDeadlineStatus, setLoadingDeadlineStatus] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<DeadlineStatus>()

  const [error, setError] = useState<IError>()

  const [isEmptyCheckingList, setCheckingListEmpty] = useState(false)

  useEffect(() => {
    getReviewDeadline()
  }, [])

  const getReviewDeadline = useCallback(() => {
    if (path && path.taskId && accessToken) {
      setLoadingDeadlineStatus(true)
      fetchReviewStatus(path.taskId, accessToken).then(response => {
        if (response.success) {
          setReviewStatus(response.payload.state)
        } else {
          setReviewStatus(undefined)
          setError(response.error)
        }
        setLoadingDeadlineStatus(false)
      })
    }
  }, [path, accessToken])

  const handleCheckingListEmpty = useCallback(() => {
    setCheckingListEmpty(true)
  }, [setCheckingListEmpty])

  return (
    <DashboardWorkBox
      isLoading={isLoadingDeadlineStatus}
      error={error}
    >
      {reviewStatus && reviewStatus !== DeadlineStatus.START && (
        <AccessTime label={"Доступ закрыт"} />
      )}

      {reviewStatus && reviewStatus === DeadlineStatus.START && path?.taskId && accessToken && !isEmptyCheckingList && (
        <CheckingsComponent
          accessToken={accessToken}
          taskId={path.taskId}
          onCheckingListEmpty={handleCheckingListEmpty}
        />
      )}

      {reviewStatus && reviewStatus === DeadlineStatus.START && path?.taskId && accessToken && isEmptyCheckingList &&  (
        <NoData label={"Работы для проверки не найдены"} />
      )}
    </DashboardWorkBox>
  )
}