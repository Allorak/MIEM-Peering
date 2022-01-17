import { FC, useEffect } from "react"
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalGridLines,
  LineMarkSeries,
  DiscreteColorLegend
} from 'react-vis';
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"
import { StatusBar } from "../../../../../components/statusBar"

import { Typography } from "@mui/material";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { TaskTypeBlock } from "../../../../../components/taskTypeBlock";
import { StepCheckBlock } from "../../../../../components/stepCheckBlock";

import { palette } from "../../../../../theme/colors";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { fetchOverview } from "../../../../../store/overview";

import * as globalStyles from "../../../../../const/styles"
import { DonutChart } from "../../../../../components/donutChart";




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
  const graphСoefficientsData = payload?.confidenceСoefficients?.map((coefficient, index) => ({ x: index, y: coefficient }))
  const graphCurrentСoefficientsData = payload?.currentConfidenceСoefficients?.map((coefficient, index) => ({ x: index, y: coefficient }))

  const legendItems = []

  if (graphCurrentСoefficientsData) {
    legendItems.push(
      <Typography variant={"body1"}>
        {'Текущий коэффициент'}
      </Typography>)
  }

  if (graphСoefficientsData) {
    legendItems.push(
      <Typography variant={"body1"}>
        {'Вычисленный коэффициент'}
      </Typography>)
  }

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {payload && (
        <>
          <Deadlines {...payload.deadlines} />
          <Box sx={styles.gridWrapper}>
            <Box sx={{ ...styles.quarterColumn, ...styles.tabletMaxWidth }}>
              <Box sx={styles.statisticsBlockWrapper}>
                <Box sx={styles.statisticsBlock}>
                  <Typography variant={'h6'} sx={styles.statisticsBlockTitle}>
                    {"Сдали работу"}
                  </Typography>
                  <DonutChart
                    total={payload.statistics.total}
                    proportion={payload.statistics.submissions}
                    color={palette.fill.info}
                    bgColor={palette.transparent.info}
                  />
                </Box>
                <Box>
                  <Typography variant={'h6'} sx={styles.statisticsBlockTitle}>
                    {"Проверили работу"}
                  </Typography>
                  <DonutChart
                    total={payload.statistics.total}
                    proportion={payload.statistics.review}
                    color={palette.fill.success}
                    bgColor={palette.transparent.success}
                  />
                </Box>
              </Box>
            </Box>
            {graphData && (
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
                        <XAxis title="- № работы" tickFormat={val => Math.round(val) === val ? val : ""} />
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
            )}
          </Box>
          <Box sx={styles.gridWrapper}>
            {(graphСoefficientsData !== undefined || graphCurrentСoefficientsData !== undefined) && (
              <Box sx={styles.graphBoxСoefficients}
                onTouchMove={(e) => e.preventDefault()}
              >
                <Box m={"15px"}>
                  <Typography
                    variant={"h6"}
                    margin={"0px 0px 10px 0px"}
                  >
                    {"График коэффициентов доверия"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Box
                      sx={{
                        height: "355px",
                        overflowY: "auto",
                        ...globalStyles.scrollStyles
                      }}
                    >
                      <XYPlot
                        height={300}
                        width={970}
                        xType="linear"
                        onTouchMove={(e) => e.preventDefault()}
                      >
                        <VerticalGridLines />
                        <YAxis title="- коэффициент" />
                        <XAxis title="- № участника" tickFormat={val => Math.round(val) === val ? val : ""} />
                        <DiscreteColorLegend items={legendItems} orientation="horizontal" />
                        {graphСoefficientsData && (
                          <LineMarkSeries
                            style={{
                              strokeWidth: '1px'
                            }}
                            lineStyle={{ stroke: palette.fill.warning }}
                            markStyle={{ fill: palette.fill.danger, strokeWidth: "0px" }}
                            data={graphСoefficientsData}
                          />
                        )}
                        {graphCurrentСoefficientsData && (
                          <LineMarkSeries
                            style={{
                              strokeWidth: '1px'
                            }}
                            className="linemark-series-example-2"
                            lineStyle={{ stroke: palette.fill.success }}
                            markStyle={{ fill: palette.fill.info, strokeWidth: "0px" }}
                            data={graphCurrentСoefficientsData}
                          />
                        )}
                      </XYPlot>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            {payload.type && (
              <Box sx={styles.quarterColumn}>
                <TaskTypeBlock type={payload.type} />
              </Box>
            )}
            {payload.step && (
              <Box sx={styles.quarterColumn}>
                <StepCheckBlock step={payload.step} />
              </Box>
            )}
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
    flexWrap: "wrap"
  } as SxProps<Theme>,
  quarterColumn: {
    flexBasis: "calc(25% - 7px)",
    flexGrow: 0,
    flexShrink: 0,
    '@media (max-width: 1321px)': {
      flexBasis: "calc(50% - 5px)",
      flexGrow: 0,
      flexShrink: 0,
    },
    '@media (max-width: 768px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
  tabletMaxWidth: {
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
  graphBox: {
    height: "360px",
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
  graphBoxСoefficients: {
    height: "410px",
    flexBasis: "calc(75% - 6px)",
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
  statisticsBlockWrapper: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px",
    '@media (max-width: 1321px)': {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    '@media (max-width: 425px)': {
      flexDirection: 'column',
    }
  } as SxProps<Theme>,
  statisticsBlock: {
    flexDirection: 'column',
  } as SxProps<Theme>,
  statisticsBlockTitle: {
    mb: "12px"
  } as SxProps<Theme>,
}