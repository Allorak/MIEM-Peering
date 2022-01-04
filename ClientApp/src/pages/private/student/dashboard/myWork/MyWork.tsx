import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";
import { AccessTime } from "../../../../../components/assessTime";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { NoData } from "../../../../../components/noData";
import { fetchWorkSubmissionStatus } from "../../../../../store/authorformStudent";
import { fetchSubmissionStatus } from "../../../../../store/deadlineStatus";
import { fetchMyWork } from "../../../../../store/myWork";
import { DeadlineStatus, ISubmissionStatus } from "../../../../../store/types";
import { MyWorkForm } from "./MyWorkForm";

export const MyWork: FC = () => {
  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const submissionWorkStatus = useAppSelector(state => state.authorForm.isLoading)
  const submissionWorkPayload = useAppSelector(state => state.authorForm.submissionWorkStatus)
  const submissionWorkError = useAppSelector(state => state.authorForm.error)
  const submissionStatus = useAppSelector(state => state.deadlineStatus.isLoading)
  const submissionError = useAppSelector(state => state.deadlineStatus.error)
  const submissionPayload = useAppSelector(state => state.deadlineStatus.submissionStatus)
  const myWorkStatus = useAppSelector(state => state.myWork.isLoading)
  const myWorkError = useAppSelector(state => state.myWork.error)
  const myWorkPayload = useAppSelector(state => state.myWork.payload)

  useEffect(() => {
    if (path && path.taskId) {
      console.log("Checking submission deadlines")
      dispatch(fetchSubmissionStatus(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (path && path.taskId && submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED) {
      console.log("Checking work complition")
      dispatch(fetchWorkSubmissionStatus(path.taskId))
    }
  }, [submissionPayload])

  useEffect(() => {
    if (path && path.taskId && submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED && submissionWorkPayload === ISubmissionStatus.COMPLETED) {
      console.log("Getting work")
      dispatch(fetchMyWork(path.taskId))
    }
  }, [submissionPayload, submissionWorkPayload])


  const mainStatus = submissionStatus ? submissionStatus : (submissionWorkStatus ? submissionWorkStatus : myWorkStatus)
  const mainError = submissionError ? submissionError : (submissionWorkError ? submissionWorkError : myWorkError)

  return (
    <DashboardWorkBox
      isLoading={mainStatus}
      error={mainError}
    >
      {myWorkPayload && myWorkPayload.answers && myWorkPayload.answers.length > 0 && submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED && submissionWorkPayload === ISubmissionStatus.COMPLETED && (
        <>
          <MyWorkForm
            myWork={myWorkPayload}
          />
        </>
      )}

      {submissionPayload && submissionPayload === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ ограничен"} />
      )}

      {submissionPayload && submissionPayload !== DeadlineStatus.NOT_STARTED && submissionWorkPayload === ISubmissionStatus.NOT_COMPLETED && (
        <>
          <NoData label={"Вашу работу не нашли"} />
        </>
      )}
    </DashboardWorkBox>
  )
}