import { FC } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"

import { IDeadlines, IStatusBar } from "../../../../../store/types"

import { StatusBar } from "../../../../../components/statusBar"


export const Overview: FC = () => {
  return (
    <Box>
      <Deadlines {...fake} />
      <Box sx={styles.gridWrapper}>
        <StatusBar {...statusData} />
        <Box sx={{height: "300px", backgroundColor: "pink"}}></Box>
      </Box>
    </Box>
  )
}

const fake: IDeadlines = {
  sBegin: new Date(),
  sEnd: new Date(),
  rBegin: new Date(),
  rEnd: new Date()
}

const statusData: IStatusBar = {
  submissions: 60,
  total: 150,
  review: 100
}

const styles = {
  gridWrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr) )",
    margin: "0px 0px 10px 0px"
  } as SxProps<Theme>,
}