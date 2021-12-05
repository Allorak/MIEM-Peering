import { FC, useEffect } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"
import { StatusBar } from "../../../../../components/statusBar"

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchOverview } from "../../../../../store/overview";


export const Overview: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const status = useAppSelector(state => state.overview.isLoading)
  const error = useAppSelector(state => state.overview.error)
  const payload = useAppSelector(state => state.overview.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchOverview(path.taskId))
  }, [])

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