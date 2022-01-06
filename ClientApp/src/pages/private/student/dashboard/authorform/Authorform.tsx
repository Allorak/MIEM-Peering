import { FC, useCallback, useEffect, useState } from "react";
import { generatePath, NavLink as RouterLink } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchAuthorformStudent, fetchWorkSubmissionStatus, postAuthorformStudent } from "../../../../../store/authorformStudent";
import { DeadlineStatus, IAuthorForm, IAuthorFormResponses, IQuestionTypes, ISubmissionStatus } from "../../../../../store/types";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { FormAuthor } from "./FormAuthor";
import { fetchSubmissionStatus } from "../../../../../store/deadlineStatus";
import { AccessTime } from "../../../../../components/assessTime";
import { Link, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { paths } from "../../../../../app/constants/paths";

export const Authorform: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const statusDeadline = useAppSelector(state => state.deadlineStatus.isLoading)
  const submissionStatus = useAppSelector(state => state.deadlineStatus.submissionStatus)
  const submissionWorkStatus = useAppSelector(state => state.authorForm.submissionWorkStatus)
  const submissionError = useAppSelector(state => state.deadlineStatus.error)
  const status = useAppSelector(state => state.authorForm.isLoading)
  const error = useAppSelector(state => state.authorForm.error)
  const authorForm = useAppSelector(state => state.authorForm.authorFormPayload)
  const [responses, setResponses] = useState<IAuthorForm>()

  const onRequest = useCallback((formResponses: IAuthorFormResponses) => {
    if (path && path.taskId && formResponses.responses)
      dispatch(postAuthorformStudent(path.taskId, formResponses))
  }, [path])

  const handleOnFormEdit = useCallback((value: string | number | undefined, questionId: string) => {
    console.log(questionId)
    setResponses(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: JSON.parse(JSON.stringify(prev.rubrics.map((item) => {
            if (item.id !== questionId) return item
            if (item.type === IQuestionTypes.SELECT_RATE && (typeof value === 'number' || typeof value === 'undefined'))
              return { ...item, response: value }
            if (item.type !== IQuestionTypes.SELECT_RATE && (typeof value === 'string' || typeof value === 'undefined'))
              return { ...item, response: value }
          })))
        }
      }
    })
  }, [responses])

  useEffect(() => {
    if (authorForm && authorForm.rubrics && authorForm.rubrics.length > 0) {
      setResponses(JSON.parse(JSON.stringify(authorForm)))
    }
  }, [authorForm])

  useEffect(() => {
    if (path && path.taskId && submissionStatus === DeadlineStatus.START && submissionWorkStatus === ISubmissionStatus.NOT_COMPLETED) {
      dispatch(fetchAuthorformStudent(path.taskId))
    }
  }, [submissionStatus, submissionWorkStatus])

  useEffect(() => {
    if (path && path.taskId && submissionStatus !== DeadlineStatus.NOT_STARTED) {
      dispatch(fetchSubmissionStatus(path.taskId))
    }
  }, [])

  useEffect(() => {
    if (path && path.taskId) {
      dispatch(fetchWorkSubmissionStatus(path.taskId))
    }
  }, [])

  const mainStatus = submissionStatus ? status : statusDeadline
  const mainError = submissionStatus ? error : submissionError

  const pathToWork = generatePath(paths.student.dashboard.work, { taskId: path?.taskId })

  return (
    <DashboardWorkBox
      isLoading={mainStatus}
      error={mainError}
    >
      {responses && responses.rubrics && responses.rubrics.length > 0 && submissionStatus === DeadlineStatus.START && submissionWorkStatus === ISubmissionStatus.NOT_COMPLETED && (
        <>
          <FormAuthor
            authorForm={responses}
            onSubmit={onRequest}
            onEdit={handleOnFormEdit}
          />
        </>
      )}

      {submissionStatus && submissionStatus === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ ограничен"} />
      )}

      {submissionStatus && submissionWorkStatus === ISubmissionStatus.COMPLETED && (submissionStatus === DeadlineStatus.START || submissionStatus === DeadlineStatus.END) && (
        <>
          <AccessTime label={"Работа успешно сдана!"} />

          <Link
            to={pathToWork}
            component={RouterLink}
            sx={styles.linkToWorks}
          >
            <Typography
              variant={"body1"}
              color={"inherit"}
            >
              {"Моя работа"}
            </Typography>
          </Link>
        </>
      )}
    </DashboardWorkBox>
  )
}

const styles = {
  linkToWorks: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    color: "primary.main",
    ":hover": {
      textDecoration: "underline"
    }
  } as SxProps<Theme>,
}