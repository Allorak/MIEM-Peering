import { FC, useEffect } from "react";
import { Grid } from "@mui/material";

import { Deadlines } from "../../../../../components/deadlines"

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { StepCheckBlock } from "../../../../../components/stepCheckBlock";
import { TaskLineGraphStudent } from "../../../../../components/taskLineGraphStudent";
import { UncheckedSubmissionsCount } from "../../../../../components/uncheckedSubmissionsCount";
import { CheckedSubmissionsCount } from "../../../../../components/checkedSubmissionsCount";

import { Coefficients, StatusWorkDashboard, Formula } from "./components";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchOverviewStudent } from "../../../../../store/overviewStudent";
import { TaskMainOverview } from "../../../../../components/taskMainOverview";


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
        <Grid container spacing={"10px"} pb={"10px"} boxSizing={'border-box'}>
          <Grid item xs={12} >
            <TaskMainOverview
              title={payload.title}
              description={payload.description}
            />
          </Grid>

          <Grid item xs={12} >
            <Deadlines
              submissionStartDateTime={payload.deadlines.submissionStartDateTime}
              submissionEndDateTime={payload.deadlines.submissionEndDateTime}
              reviewStartDateTime={payload.deadlines.reviewStartDateTime}
              reviewEndDateTime={payload.deadlines.reviewEndDateTime}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <StepCheckBlock step={payload.taskType} />
          </Grid>

          <Grid item xs={12} lg={6} >
            <Formula
              coefficientBefore={payload.studentConfidenceFactors?.before}
              goodCoefficientBonus={payload.goodConfidenceBonus}
              badCoefficientPenalty={payload.badConfidencePenalty}
              finalGrade={payload.finalGrade}
              submissionGrade={payload.submissionGrade}
              reviewGrade={payload.reviewGrade}
              submissionWeight={payload.submissionWeight}
              reviewWeight={payload.reviewWeight}
            />
          </Grid>

          {typeof payload.submissionStatus === 'boolean' && (
            <Grid item xs={12} sm={6} lg={3}>
              <StatusWorkDashboard submissionStatus={payload.submissionStatus} />
            </Grid>
          )}

          {typeof payload.assignedSubmissions === 'number' && typeof payload.reviewedSubmissions === 'number' && (
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

          {payload.studentConfidenceFactors && (typeof payload.studentConfidenceFactors.after === 'number' || typeof payload.studentConfidenceFactors.before === 'number') && (
            <Grid item xs={12} sm={6} lg={3}>
              <Coefficients
                after={payload.studentConfidenceFactors.after}
                before={payload.studentConfidenceFactors.before}
              />
            </Grid>
          )}

          {payload.studentGrades && payload.studentGrades.coordinates && payload.studentGrades.coordinates.length > 0 && (
            <Grid item xs={12} lg={9}>
              <TaskLineGraphStudent graphProps={payload.studentGrades} />
            </Grid>
          )}


        </Grid>
      )}
    </DashboardWorkBox >
  )
}