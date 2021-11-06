import { FC } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"
import { StatusBar } from "../../../../../components/statusBar"

import { IDeadlines, IStatusBar } from "../../../../../store/types"


export const Overview: FC = () => {
  return (
    <Box>
      <Deadlines {...fake} />

      <Box sx={styles.gridWrapper}>
        <Box sx={styles.statusbarBox}>
          <StatusBar {...statusData} />
        </Box>


        <Box sx={styles.graphBox}></Box>
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
  submissions: 50,
  total: 150,
  review: 140
}

const styles = {
  gridWrapper: {
    display: "flex",
    padding: "0px 0px 10px 0px",
    gap: "10px",
    '@media (max-width: 1321px)': {
      flexWrap: "wrap"
    },
  } as SxProps<Theme>,
  statusbarBox: {
    flexBasis: "calc(25% - 7px)",
    flexGrow: 0,
    flexShrink: 0,
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
  graphBox: {
    height: "300px",
    flexBasis: "calc(75% - 3px)",
    flexGrow: 0,
    flexShrink: 0,
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    backgroundColor: 'common.white',
    borderRadius: '4px',
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
}