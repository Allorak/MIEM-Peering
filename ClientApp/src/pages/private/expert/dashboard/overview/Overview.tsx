import { FC, useEffect } from "react"
import { SxProps, Theme } from "@mui/system"
import { Grid } from "@mui/material";

import { Deadlines } from "../../../../../components/deadlines"
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathExDashboard } from "../../../../../app/hooks/usePrivatePathExDashboard";

import { fetchOverviewExpert } from "../../../../../store/overviewExpert";
import { UncheckedSubmissionsCount } from "../../../../../components/uncheckedSubmissionsCount";
import { CheckedSubmissionsCount } from "../../../../../components/checkedSubmissionsCount";


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

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {
        payload && (
          <Grid container spacing={"10px"} padding={"0px 0px 5px 0px"}>
            <Grid item xs={12} >
              <Deadlines
                submissionStartDateTime={payload.deadlines.submissionStartDateTime}
                submissionEndDateTime={payload.deadlines.submissionEndDateTime}
                reviewStartDateTime={payload.deadlines.reviewStartDateTime}
                reviewEndDateTime={payload.deadlines.reviewEndDateTime}
              />
            </Grid>

            {typeof payload.reviewedSubmissions === 'number' && typeof payload.assignedSubmissions === 'number' && (
              <>
                <Grid item xs={12} sm={6} lg={3}>
                  <CheckedSubmissionsCount reviewedSubmissions={payload.reviewedSubmissions} />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <UncheckedSubmissionsCount
                    assignedSubmissions={payload.assignedSubmissions}
                    reviewedSubmissions={payload.reviewedSubmissions}
                  />
                </Grid>
              </>
            )}
          </Grid>
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