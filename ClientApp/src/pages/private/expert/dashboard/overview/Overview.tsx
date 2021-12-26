import { FC, useEffect } from "react"
import { Box, SxProps, Theme } from "@mui/system"

import { Deadlines } from "../../../../../components/deadlines"

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";

import { fetchOverviewExpert } from "../../../../../store/overviewExpert";
import { StatusBarExpert } from "../../../../../components/statusBarExpert";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";


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
  },[])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {
        payload && (
          <>
            <Deadlines {...payload.deadlines} />

            <Box sx={styles.gridWrapper}>
              <Box sx={styles.statusbarBox}>
                <StatusBarExpert
                  checkedWorksCount={payload.checkedWorksCount}
                  assignedWorksCount={payload.assignedWorksCount}
                />
              </Box>
            </Box>
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
  statusbarBox: {
    flexBasis: "calc(25% - 7px)",
    flexGrow: 0,
    flexShrink: 0,
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>
}