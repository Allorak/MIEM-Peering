import { FC, useCallback, useEffect, useState } from "react"
import { useNavigate, generatePath } from "react-router-dom";
import { Box, SxProps, Theme } from "@mui/system"

import { Subheader } from "../../../../../components/subheader"
import { WorkBox } from "../../../../../components/workBox"

import { NewTaskMainInfo } from "./forms/NewTaskMainInfo"
import { NewTaskAuthorForm } from "./forms/NewTaskAuthorForm"
import { NewTaskSettings } from "./forms/NewTaskSettings"

import { actions, createTasks, fetchTaskStep } from "../../../../../store/tasks"

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { usePrivatePathT } from "../../../../../app/hooks/usePrivatePathT";
import { paths } from "../../../../../app/constants/paths";
import { INewTask, INewTaskMainInfo, INewTaskSettings, INewTaskState, INewQuestionRubrics, IQuestionTypes, PeerSteps, PeerTaskTypes } from "../../../../../store/types"

import * as globalStyles from "../../../../../const/styles"

export const TaskAdd: FC = () => {

  const dispatch = useAppDispatch()
  const history = useNavigate()
  const { location, path: pathT } = usePrivatePathT()

  const isLoading = useAppSelector(state => state.tasks.isLoading)
  const isLock = useAppSelector(state => state.tasks.isLock)
  const error = useAppSelector(state => state.tasks.error)
  const newTaskPayload = useAppSelector(state => state.tasks.newTaskPayload)
  const hasConfidenceFactor = useAppSelector(state => state.tasks.hasConfidenceFactor)

  const [step, setStpep] = useState<INewTaskState>('main-info')
  const [newTaskItem, setNewTaskItem] = useState<INewTask>(initialTask)

  const setMainInfo = useCallback((mainInfo: INewTaskMainInfo) => {
    setNewTaskItem(prev => ({
      ...prev,
      mainInfo
    }))
    setStpep('author-form')
  }, [newTaskItem.mainInfo, step])

  const setFormRubrics = useCallback((responses: INewQuestionRubrics) => {
    if (step === 'author-form') {
      setNewTaskItem(prev => ({
        ...prev,
        authorForm: {
          rubrics: JSON.parse(JSON.stringify(responses))
        }
      }))
      setStpep('peer-form')
    }

    if (step === 'peer-form') {
      setNewTaskItem(prev => ({
        ...prev,
        peerForm: {
          rubrics: JSON.parse(JSON.stringify(responses))
        }
      }))
      setStpep('settings')
    }

  }, [step, newTaskItem])

  useEffect(() => {
    dispatch(actions.createReset())

    if (pathT && pathT.courseId) {
      dispatch(fetchTaskStep(pathT.courseId))
    }
  }, [dispatch, pathT?.courseId])

  const setSettings = useCallback((response: INewTaskSettings) => {
    if (response.submissionStartDateTime && response.submissionEndDateTime && response.reviewEndDateTime && response.reviewStartDateTime) {
      const submissionStartDateTime = new Date(response.submissionStartDateTime.getTime() - (response.submissionStartDateTime.getTimezoneOffset() * 60000))
      const submissionEndDateTime = new Date(response.submissionEndDateTime.getTime() - (response.submissionEndDateTime.getTimezoneOffset() * 60000))
      const reviewStartDateTime = new Date(response.reviewStartDateTime.getTime() - (response.reviewStartDateTime.getTimezoneOffset() * 60000))
      const reviewEndDateTime = new Date(response.reviewEndDateTime.getTime() - (response.reviewEndDateTime.getTimezoneOffset() * 60000))

      if (pathT && pathT.courseId)
        dispatch(createTasks({
          ...JSON.parse(JSON.stringify(newTaskItem)),
          settings: JSON.parse(JSON.stringify({
            submissionStartDateTime,
            submissionEndDateTime,
            reviewStartDateTime,
            reviewEndDateTime,
            reviewType: response.reviewType,
            submissionWeight: Number(response.submissionWeight),
            reviewWeight: Number(response.reviewWeight),
            submissionsToCheck: Number(response.submissionsToCheck),
            ...(!hasConfidenceFactor && { experts: response.experts }),
            ...(hasConfidenceFactor && {
              goodCoefficientBonus: Number(response.goodCoefficientBonus),
              badCoefficientPenalty: Number(response.badCoefficientPenalty)
            })
          }))
        }, pathT.courseId))
    }
  }, [step, newTaskItem, pathT, hasConfidenceFactor])

  if (newTaskPayload && newTaskPayload.id
    && pathT && pathT.courseId) {
    history(generatePath(paths.teacher.dashboard.overview, { taskId: newTaskPayload.id }))
    dispatch(actions.createReset())
  }

  return (
    <WorkBox
      isLoading={isLoading}
      isLock={isLock}
      error={error}
    >
      {hasConfidenceFactor !== undefined && (
        <>
          <Subheader activeStep={step} />

          <Box sx={styles.stepsContainer}>
            <Box sx={styles.container}>
              {step === 'main-info' && (
                <NewTaskMainInfo
                  onSubmit={setMainInfo}
                />
              )}

              {step === 'author-form' && (
                <NewTaskAuthorForm
                  onSubmit={setFormRubrics}
                  rubrics={newTaskItem.authorForm.rubrics}
                />
              )}

              {step === 'peer-form' && (
                <NewTaskAuthorForm
                  onSubmit={setFormRubrics}
                  rubrics={newTaskItem.peerForm.rubrics}
                  isPeerForm
                />
              )}

              {step === 'settings' && (
                <NewTaskSettings
                  onSubmit={setSettings}
                  hasConfidenceFactor={hasConfidenceFactor}
                />
              )}
            </Box>
          </Box>
        </>
      )}
    </WorkBox>
  )
}

const styles = {
  stepsContainer: {
    maxHeight: 'calc(100vh - 128px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  content: {
    margin: '10x 0px 0px 0px'
  },
  container: {
    maxWidth: '1000px',
    margin: '0px auto',
    padding: '20px 10px',
  } as SxProps<Theme>,
}

const initialTask: INewTask = {
  mainInfo: {
    title: ""
  },
  settings: {
    submissionStartDateTime: new Date(),
    submissionEndDateTime: new Date(),
    reviewStartDateTime: new Date(),
    reviewEndDateTime: new Date(),
    submissionsToCheck: 2,
    reviewType: PeerTaskTypes.DOUBLE_BLIND,
    submissionWeight: 20,
    reviewWeight: 80
  },
  authorForm: {
    rubrics: [
      {
        order: 0,
        title: "Write your work here 📝",
        type: IQuestionTypes.TEXT,
        required: true
      },
      {
        order: 1,
        title: "Additional wishes when evaluating ☝",
        required: false,
        type: IQuestionTypes.SHORT_TEXT,
      }
    ]
  },
  peerForm: {
    rubrics: [
      {
        order: 0,
        title: "Rate the work",
        type: IQuestionTypes.SELECT_RATE,
        required: true,
        minValue: 0,
        maxValue: 10,
        coefficientPercentage: 100
      },
      {
        order: 1,
        title: "What is good about this work? 👍",
        type: IQuestionTypes.TEXT,
        required: false,
      },
      {
        order: 2,
        title: "What's wrong with this work? 👎",
        type: IQuestionTypes.TEXT,
        required: false,
      }
    ]
  }

}