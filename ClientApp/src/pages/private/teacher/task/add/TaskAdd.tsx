import { Box, SxProps, Theme } from "@mui/system"
import { FC, useState } from "react"
import { Subheader } from "../../../../../components/subheader"

import * as globalStyles from "../../../../../const/styles"
import { INewTaskState } from "../../../../../store/types"


const states = [
  'peer-form',
  'author-form',
  'settings'
] as INewTaskState[]

export const TaskAdd: FC = () => {

  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState<any>()

  return (
    <Box sx={globalStyles.container}>
      {/* workbox */}
      {/* subheader */}
      <Box sx={styles.header}>
        <Subheader activeStep={states[step]} />
      </Box>

      <Box sx={styles.content}>

      </Box>
    </Box>
  )
}

const NewTaskContent: FC<{step: INewTaskState}> = () => {
  return (
    <Box>

    </Box>
  )
}

const styles = {
  header: {
    margin: '100px 0px 0px 0px'
  } as SxProps<Theme>,
  content: {
    margin: '10x 0px 0px 0px'
  }
}