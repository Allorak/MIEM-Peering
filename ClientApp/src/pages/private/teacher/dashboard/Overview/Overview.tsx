import { FC, useEffect } from "react"
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalGridLines,
  LineMarkSeries
} from 'react-vis';
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"
import { StatusBar } from "../../../../../components/statusBar"

import { Typography } from "@mui/material";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { palette } from "../../../../../theme/colors";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { fetchOverview } from "../../../../../store/overview";


export const Overview: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.overview.isLoading)
  const error = useAppSelector(state => state.overview.error)
  const payload = useAppSelector(state => state.overview.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchOverview(path.taskId))
  }, [])

  const graphData = payload?.grades?.map((grade, index) => ({ x: index, y: grade }))

  
  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {payload && (
        <>
          <Deadlines {...payload.deadlines} />

          <Box sx={styles.gridWrapper}>
            <Box sx={styles.statusbarBox}>
              <StatusBar {...payload.statistics} />
            </Box>

            <Box sx={styles.graphBox}
              onTouchMove={(e) => e.preventDefault()}
            >
              <Box m={"15px"}>
                <Typography
                  variant={"h6"}
                  margin={"0px 0px 10px 0px"}
                >
                  {"График успеваемости"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      overflowY: "auto"
                    }}
                  >
                    <XYPlot
                      height={300}
                      width={970}
                      xType="linear"
                      onTouchMove={(e) => e.preventDefault()}
                    >
                      <HorizontalGridLines />
                      <VerticalGridLines />
                      <YAxis title="- оценки" />
                      <XAxis title="- № работы" />
                      <LineMarkSeries
                        style={{
                          strokeWidth: '1px'
                        }}
                        lineStyle={{ stroke: palette.fill.secondary }}
                        markStyle={{ fill: palette.fill.primary, strokeWidth: "0px" }}
                        data={graphData}
                      />

                    </XYPlot>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}

    </DashboardWorkBox>
  )
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