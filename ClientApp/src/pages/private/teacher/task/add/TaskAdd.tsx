import { FC, useCallback, useState } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Subheader } from "../../../../../components/subheader"
import { NewTaskMainInfo } from "./forms/NewTaskMainInfo"
import { NewTaskAuthorForm } from "./forms/NewTaskAuthorForm"
import { NewTaskPeerForm } from "./forms/NewTaskPeerForm"
import { NewTaskSettings } from "./forms/NewTaskSettings"

import { INewTask, INewTaskAuthorForm, INewTaskMainInfo, INewTaskState, IQuestionRubrics, IQuestionTypes } from "../../../../../store/types"
import * as globalStyles from "../../../../../const/styles"


export const TaskAdd: FC = () => {

  const [responses, setResponses] = useState<any>()

  return (


    <Box>
      <NewTaskContent />
    </Box>

  )
}

const NewTaskContent: FC = () => {
  const [step, setStpep] = useState<INewTaskState>('main-info')
  const [newTaskItem, setNewTaskItem] = useState<INewTask>(initialTask)

  const setMainInfo = useCallback((mainInfo: INewTaskMainInfo) => {
    setNewTaskItem(prev => ({
      ...prev,
      mainInfo
    }))
    setStpep('author-form')
  }, [newTaskItem.mainInfo, step])

  const setFormRubrics = useCallback((responses: IQuestionRubrics) => {
    if (step === 'author-form') {
      setNewTaskItem(prev => ({
        ...prev,
        authorForm: {
          rubrics: responses.map(response => ({ ...response }))
        }
      }))
      setStpep('peer-form')
    }

    if (step === 'peer-form') {
      setNewTaskItem(prev => ({
        ...prev,
        peerForm: {
          rubrics: responses.map(response => ({ ...response }))
        }
      }))
      setStpep('settings')
    }

  }, [step, newTaskItem])

  return (
    <Box>
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
            />
          )}

          {step === 'settings' && (
            <NewTaskSettings
            // onSubmit={setMainInfo}
            />
          )}
        </Box>
      </Box>
    </Box>
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
    submission: {
      begin: undefined,
      end: undefined
    },
    review: {
      begin: undefined,
      end: undefined
    }
  },
  authorForm: {
    rubrics: [
      {
        id: 0,
        title: "Write your work here 📝",
        type: IQuestionTypes.TEXT,
        required: true
      },
      {
        id: 1,
        title: "Additional wishes when evaluating ☝",
        required: false,
        type: IQuestionTypes.SHORT_TEXT,
      }
    ]
  },
  peerForm: {
    rubrics: [
      {
        id: 0,
        title: "Rate the work",
        type: IQuestionTypes.SELECT_RATE,
        required: true,
        minValue: 0,
        maxValue: 10
      },
      {
        id: 1,
        title: "What is good about this work? 👍",
        type: IQuestionTypes.TEXT,
        required: false,
      },
      {
        id: 2,
        title: "What's wrong with this work? 👎",
        type: IQuestionTypes.TEXT,
        required: false,
      }
    ]
  }

}