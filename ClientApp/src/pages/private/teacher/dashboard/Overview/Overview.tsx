import { FC } from "react"
import { Box } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"

import { IDeadlines } from "../../../../../store/types"


export const Overview: FC = () => {
  return (
    <Box>
      <Deadlines {...fake} />
    </Box>
  )
}

const fake: IDeadlines = {
  sBegin: new Date(),
  sEnd: new Date(),
  rBegin: new Date(),
  rEnd: new Date()
}