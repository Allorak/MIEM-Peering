import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { NoData } from "../../../../../components/noData";
import { CheckingsComponent } from "../../../../../components/checkingsComponent";

import { fetchReviewStatus } from "../../../../../store/deadlineStatus";

import { DeadlineStatus, IError } from "../../../../../store/types";
import { ReviewsComponent } from "../../../../../components/reviewsComponent";


export const Checkings: FC = () => {
  const { path } = usePrivatePathStDashboard()

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const [isLoadingDeadlineStatus, setLoadingDeadlineStatus] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<DeadlineStatus>()

  const [error, setError] = useState<IError>()

  const [isEmptyCheckingList, setCheckingListEmpty] = useState(false)
  const [isEmptyReviewList, setEmptyReviewList] = useState(false)

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

  const handleReviewListEmpty = useCallback(() => {
    setEmptyReviewList(true)
  }, [setCheckingListEmpty])

  const isReviewTime = useMemo(() => (
    (reviewStatus && reviewStatus === DeadlineStatus.START && isEmptyCheckingList) ||
    (reviewStatus && reviewStatus === DeadlineStatus.END)
  ), [reviewStatus, isEmptyCheckingList])

  return (
    <DashboardWorkBox
      isLoading={isLoadingDeadlineStatus}
      error={error}
    >
      {reviewStatus && reviewStatus === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ закрыт"} />
      )}

      {reviewStatus && reviewStatus === DeadlineStatus.START && path?.taskId && accessToken && !isEmptyCheckingList && (
        <CheckingsComponent
          accessToken={accessToken}
          taskId={path.taskId}
          onCheckingListEmpty={handleCheckingListEmpty}
        />
      )}

      {isReviewTime && path?.taskId && accessToken && !isEmptyReviewList && (
        <ReviewsComponent
          taskId={path.taskId}
          accessToken={accessToken}
          onReviewEmpty={handleReviewListEmpty}
        />
      )}

      {isReviewTime && path?.taskId && accessToken && isEmptyReviewList && (
        <NoData label={"Ваши проверки не найдены"} />
      )}
    </DashboardWorkBox>
  )
}