import { FC, useEffect } from "react"
import { SxProps, Theme } from "@mui/system"
import { Box } from "@mui/material";

import { Deadlines } from "../../../../../components/deadlines"

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { StepCheckBlock } from "../../../../../components/stepCheckBlock";
import { UncheckedFileCard } from "../../../../../components/uncheckedFileCard";
import { CheckedFileCard } from "../../../../../components/checkedFileCard";
import { CoefficientsCard } from "../../../../../components/сoefficientsCard";
import { TaskLineGraphStudent } from "../../../../../components/taskLineGraphStudent";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchOverviewStudent } from "../../../../../store/overviewStudent";
import { StatusWorkDashboard } from ".";




export const Overview: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const status = useAppSelector(state => state.overviewStudent.isLoading)
  const error = useAppSelector(state => state.overviewStudent.error)
  const payload = useAppSelector(state => state.overviewStudent.payload)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchOverviewStudent(path.taskId))
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
            {payload.status && (
              <>
                <Box sx={styles.quarterColumn}>
                  <StatusWorkDashboard submissionStatus={payload.submissionStatus} />
                </Box>
                <Box sx={styles.quarterColumn}>
                  <UncheckedFileCard
                    {...payload.status} />
                </Box>
                <Box sx={styles.quarterColumn}>
                  <CheckedFileCard
                    {...payload.status} />
                </Box>
              </>
            )}
            {payload.studentConfidenceСoefficients && (typeof payload.studentConfidenceСoefficients.after === 'number' || typeof payload.studentConfidenceСoefficients.until === 'number') && (
              <Box sx={styles.quarterColumn}>
                <CoefficientsCard {...payload.studentConfidenceСoefficients} />
              </Box>
            )}
          </Box>
          <Box sx={styles.gridWrapper}>
            {(payload.step === 'FirstStep') && (
              <Box sx={{ ...styles.quarterColumn, ...styles.tabletMaxWidth }}>
                <StepCheckBlock step={payload.step} />
              </Box>
            )}
            {payload.studentGrades && payload.studentGrades.coordinates && payload.studentGrades.coordinates.length > 0 && (
              <TaskLineGraphStudent graphProps={payload.studentGrades} />
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
    '@media (max-width: 1321px)': {
      flexWrap: "wrap"
    },
  } as SxProps<Theme>,
  tabletMaxWidth: {
    '@media (max-width: 1321px)': {
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
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
  quarterColumnItem: {
    mb: '10px'
  } as SxProps<Theme>,
}