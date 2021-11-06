import { FC } from "react"
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  VerticalGridLines
} from 'react-vis';
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"
import { StatusBar } from "../../../../../components/statusBar"

import { IDeadlines, IStatusBar } from "../../../../../store/types"
import { Typography } from "@mui/material";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";


export const Overview: FC = () => {

  const data = [] as Array<{ y: number, x: number }>

  for (let i = 1; i < 160; i++) {
    data.push({ y: Math.random() * (10 - 0) + 0, x: i })
  }

  return (
    <DashboardWorkBox
      isLoading={false}
    >
      <Deadlines {...fake} />

      <Box sx={styles.gridWrapper}>
        <Box sx={styles.statusbarBox}>
          <StatusBar {...statusData} />
        </Box>

        <Box sx={styles.graphBox}>
          <Box m={"15px"}>
            <Typography variant={"h6"} margin={"0px 0px 10px 0px"}>
              {"График успеваемости"}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ overflowY: "auto" }}>
                <XYPlot height={300} width={970} xType="linear" >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <YAxis title="- оценки" />
                  <XAxis title="- № работы" />
                  <LineSeries
                    data={data}
                  />
                </XYPlot>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardWorkBox>
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
    height: "365px",
    flexBasis: "calc(75% - 3px)",
    flexGrow: 0,
    flexShrink: 0,
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    backgroundColor: 'common.white',
    borderRadius: '4px',
    overflowX: "auto",
    overflowY: "hidden",
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
}