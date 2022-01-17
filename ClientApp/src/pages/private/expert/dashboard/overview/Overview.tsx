import { FC, useEffect } from "react"
import { Box, SxProps, Theme } from "@mui/system"
import { Typography } from "@mui/material";
import { palette } from "../../../../../theme/colors";

import { Deadlines } from "../../../../../components/deadlines"
import { DonutChart } from "../../../../../components/donutChart";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";

import { fetchOverviewExpert } from "../../../../../store/overviewExpert";


export const Overview: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathExDashboard()

  const status = useAppSelector(state => state.overviewExpert.isLoading)
  const error = useAppSelector(state => state.overviewExpert.error)
  const payload = useAppSelector(state => state.overviewExpert.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchOverviewExpert(path.taskId))
  }, [])

  useEffect(() => {
    console.log(payload)
  }, [])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {
        payload && (
          <>
            <Deadlines {...payload.deadlines} />
            {payload.assignedWorksCount && payload.checkedWorksCount && (
              <Box sx={styles.gridWrapper}>
                <Box sx={styles.quarterColumn}>
                  <Box sx={styles.wrapper}>
                    <Typography variant={'h6'} sx={styles.statisticsBlockTitle}>
                      {"Статистика проверенных работ"}
                    </Typography>
                    <DonutChart
                      total={payload.assignedWorksCount}
                      proportion={payload.checkedWorksCount}
                      color={palette.fill.info}
                      bgColor={palette.transparent.info}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )
      }
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
  quarterColumn: {
    flexBasis: "calc(25% - 7px)",
    flexGrow: 0,
    flexShrink: 0,
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px"
  } as SxProps<Theme>,
  statisticsBlockTitle: {
    mb: "12px"
  } as SxProps<Theme>,
}