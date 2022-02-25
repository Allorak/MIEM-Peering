import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { generatePath, NavLink as RouterLink } from 'react-router-dom'
import { Link, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { EditableForm } from "../../../../../components/editableForm";
import { AccessTime } from "../../../../../components/assessTime";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchAuthorForm, fetchSubmissionPossibility, postSubmission } from "../../../../../store/authorformStudent";
import { DeadlineStatus, IAuthorForm, IAuthorFormResponses, IError, IQuestionTypes, ISubmissionStatus } from "../../../../../store/types";
import { fetchSubmissionStatus } from "../../../../../store/deadlineStatus";

import { paths } from "../../../../../app/constants/paths";


export const Authorform: FC = () => {
  const { path } = usePrivatePathStDashboard()

  const pathToWork = generatePath(paths.student.dashboard.work, { taskId: path?.taskId })

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const [isLoadingDeadlineStatus, setLoadingDeadlineStatus] = useState(false)
  const [submissionDeadlineStatus, setSubmissionDeadlineStatus] = useState<DeadlineStatus>()

  const [isLoadingSubmissionPossibility, setLoadingSubmissionPossibility] = useState(false)
  const [submissionPossibility, setSubmissionPossibility] = useState<ISubmissionStatus>()

  const [isLoadingAuthorForm, setLoadingAuthorForm] = useState(false)
  const [authorForm, setAuthorForm] = useState<IAuthorForm>()

  const [isLoadingSubmission, setLoadingSubmission] = useState(false)
  const [submission, setSumbission] = useState<IAuthorForm>()

  const [error, setError] = useState<IError>()

  useEffect(() => {
    getSubmissionStatus()
  }, [])

  useEffect(() => {
    getSubmissionPossibility()
  }, [submissionDeadlineStatus])

  useEffect(() => {
    getAuthorForm()
  }, [submissionPossibility])

  useEffect(() => {
    if (authorForm && authorForm.rubrics && authorForm.rubrics.length > 0) {
      setSumbission(authorForm)
    }
  }, [authorForm])

  const getSubmissionStatus = useCallback(() => {
    if (path && path.taskId && accessToken) {
      setLoadingDeadlineStatus(true)
      fetchSubmissionStatus(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionDeadlineStatus(response.payload.state)
        } else {
          setSubmissionDeadlineStatus(undefined)
          setError(response.error)
        }
        setLoadingDeadlineStatus(false)
      })
    }
  }, [path, accessToken])

  const getSubmissionPossibility = useCallback(() => {
    if (path && path.taskId && accessToken && submissionDeadlineStatus && submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED) {
      setLoadingSubmissionPossibility(true)
      fetchSubmissionPossibility(path.taskId, accessToken).then(response => {
        if (response.success) {
          setSubmissionPossibility(response.payload)
        } else {
          setSubmissionPossibility(undefined)
          setError(error)
        }
        setLoadingSubmissionPossibility(false)
      })
    }
  }, [submissionDeadlineStatus, path, accessToken])

  const getAuthorForm = useCallback(() => {
    if (path && path.taskId && accessToken && submissionDeadlineStatus === DeadlineStatus.START && submissionPossibility === ISubmissionStatus.NOT_COMPLETED) {
      setLoadingAuthorForm(true)
      fetchAuthorForm(path.taskId, accessToken).then(response => {
        if (response.success) {
          setAuthorForm(JSON.parse(
            JSON.stringify(response.payload)
          ))
        } else {
          setAuthorForm(undefined)
          setError(response.error)
        }
        setLoadingAuthorForm(false)
      })
    }
  }, [path, accessToken, submissionDeadlineStatus, submissionPossibility])

  const onRequest = useCallback((formResponses: IAuthorFormResponses) => {
    if (path && path.taskId && formResponses.answers && accessToken) {
      setLoadingSubmission(true)
      postSubmission(path.taskId, formResponses, accessToken).then(response => {
        if (response.success) {
          setSumbission(undefined)
          setAuthorForm(undefined)
          setSubmissionPossibility(undefined)
          setSubmissionDeadlineStatus(undefined)
        } else {
          setError(response.error)
        }
        setLoadingSubmission(false)
        getSubmissionStatus()
      })
    }
  }, [path, accessToken])

  const handleOnFormEdit = useCallback((value: string | number | File | undefined, questionId: string) => {
    setSumbission(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: prev.rubrics.map(item => {
            if (item.questionId !== questionId) return item

            switch (item.type) {
              case IQuestionTypes.SELECT_RATE:
              case IQuestionTypes.MULTIPLE:
                return JSON.parse(JSON.stringify({
                  ...item,
                  ...(typeof value !== 'string' && typeof value !== 'object' && { value: value })
                }))

              case IQuestionTypes.SHORT_TEXT:
              case IQuestionTypes.TEXT:
                return JSON.parse(JSON.stringify({
                  ...item,
                  ...(typeof value !== 'number' && typeof value !== 'object' && { response: value?.trim() })
                }))

              case IQuestionTypes.FILE:
                return {
                  ...item,
                  ...(typeof value !== "number" && typeof value !== "string" && { file: value })
                }
            }
          })
        }
      }
    })
  }, [submission])

  const dashboardLoading = useMemo(() => (
    isLoadingDeadlineStatus ?? isLoadingSubmissionPossibility ?? isLoadingAuthorForm ?? isLoadingSubmission
  ), [isLoadingDeadlineStatus, isLoadingSubmissionPossibility, isLoadingAuthorForm, isLoadingSubmission])

  return (
    <DashboardWorkBox
      isLoading={dashboardLoading}
      error={error}
    >
      {submissionDeadlineStatus === DeadlineStatus.START && submissionPossibility === ISubmissionStatus.NOT_COMPLETED && authorForm && submission && (
        <EditableForm
          form={submission}
          onSubmit={onRequest}
          onEdit={handleOnFormEdit}
        />
      )}

      {submissionDeadlineStatus === DeadlineStatus.NOT_STARTED && (
        <AccessTime label={"Доступ ограничен"} />
      )}

      {submissionDeadlineStatus === DeadlineStatus.END && submissionPossibility === ISubmissionStatus.NOT_COMPLETED && (
        <AccessTime label={"Доступ ограничен. Работа не сдана"} />
      )}

      {submissionDeadlineStatus && submissionDeadlineStatus !== DeadlineStatus.NOT_STARTED && submissionPossibility === ISubmissionStatus.COMPLETED && (
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