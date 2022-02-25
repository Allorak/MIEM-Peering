import { FC, useCallback, useEffect, useState } from "react";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { AccessTime } from "../../../../../components/assessTime";
import { NoData } from "../../../../../components/noData";
import { CheckingsComponent } from "../../../../../components/checkingsComponent";

import { fetchSubmissionStatus } from "../../../../../store/deadlineStatus";

import { DeadlineStatus, IError } from "../../../../../store/types";


export const Checkings: FC = () => {
  const accessToken = useAppSelector(state => state.auth.accessToken)

  const { path } = usePrivatePathTDashboard()

  const [isLoadingDeadlineStatus, setLoadingDeadlineStatus] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<DeadlineStatus>()

  const [isEmptyCheckingList, setCheckingListEmpty] = useState(false)

  const [error, setError] = useState<IError>()

  useEffect(() => {
    getSubmissionStatus()
  }, [])

  const getSubmissionStatus = useCallback(() => {
    if (path && path.taskId && accessToken) {
      setLoadingDeadlineStatus(true)
      fetchSubmissionStatus(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionStatus(response.payload.state)
        } else {
          setSubmissionStatus(undefined)
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
      {submissionStatus && submissionStatus !== DeadlineStatus.END && (
        <AccessTime label={"Сдача работ еще не закончена"} />
      )}

      {submissionStatus && submissionStatus === DeadlineStatus.END && path?.taskId && accessToken && !isEmptyCheckingList && (
        <CheckingsComponent
          accessToken={accessToken}
          taskId={path.taskId}
          onCheckingListEmpty={handleCheckingListEmpty}
        />
      )}

      {submissionStatus && submissionStatus === DeadlineStatus.END && path?.taskId && accessToken && isEmptyCheckingList && (
        <NoData label={"Работы для проверки не найдены"} />
      )}
    </DashboardWorkBox>
  )
}