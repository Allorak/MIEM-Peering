import { FC, useCallback, useState } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Subheader } from "../../../../../components/subheader"
import { NewTaskMainInfo } from "./forms/NewTaskMainInfo"
import { NewTaskAuthorForm } from "./forms/NewTaskAuthorForm"
import { NewTaskPeerForm } from "./forms/NewTaskPeerForm"
import { NewTaskSettings } from "./forms/NewTaskSettings"

import { INewTask, INewTaskMainInfo, INewTaskState } from "../../../../../store/types"
import * as globalStyles from "../../../../../const/styles"


export const TaskAdd: FC = () => {

  const [responses, setResponses] = useState<any>()

  return (


    <Box>
      <NewTaskContent/>
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

  return (
    <Box>
      <Subheader activeStep={step} />

      <Box sx={styles.stepsContainer}>
        {step === 'main-info' && (
          <NewTaskMainInfo
            onSubmit={setMainInfo}
          />
        )}

        {step === 'author-form' && (
          <NewTaskAuthorForm
          // onSubmit={setMainInfo}
          />
        )}

        {step === 'peer-form' && (
          <NewTaskPeerForm
          // onSubmit={setMainInfo}
          />
        )}

        {step === 'settings' && (
          <NewTaskSettings
          // onSubmit={setMainInfo}
          />
        )}
      </Box>
    </Box>
  )
}

const styles = {
  stepsContainer: {
    maxWidth: '1000px',
    margin: '20px auto'
  } as SxProps<Theme>,
  content: {
    margin: '10x 0px 0px 0px'
  }
}

const initialTask: INewTask = {
  mainInfo: {
    title: ""
  },
  settings: {},
  peerForm: {},
  authorForm: {}

}