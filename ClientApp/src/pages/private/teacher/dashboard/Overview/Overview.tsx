import { FC, useEffect } from "react";
import { Grid } from "@mui/material";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { TaskTypeBlock } from "../../../../../components/taskTypeBlock";
import { StepCheckBlock } from "../../../../../components/stepCheckBlock";
import { DonutChart } from "../../../../../components/donutChart";
import { Deadlines } from "../../../../../components/deadlines"

import { FinalGradesGraph, Formula, СoefficientsFactorGraph, GradeColumnChart } from "./components";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { fetchOverview } from "../../../../../store/overview";
import { TaskMainOverview } from "../../../../../components/taskMainOverview";


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
              ltiConsumerKey={payload.ltiConsumerKey}
              ltiSharedSecret={payload.ltiSharedSecret}
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

          <Grid item xs={12} lg={4}>
            <TaskTypeBlock type={payload.reviewType} />
          </Grid>

          <Grid item xs={12} lg={4}>
            <StepCheckBlock step={payload.taskType} />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Formula
              submissionWeight={payload.submissionWeight}
              reviewWeight={payload.reviewWeight}
              badCoefficientPenalty={payload.badConfidencePenalty}
              goodCoefficientBonus={payload.goodConfidenceBonus}
            />
          </Grid>

          {((typeof payload.statistics.submissions === 'number' && payload.statistics.totalSubmissions) || (typeof payload.statistics.reviews === 'number' && payload.statistics.totalReviews)) && (
            <Grid item xs={12} lg={3}>
              <DonutChart
                submissions={payload.statistics.submissions}
                totalSubmissions={payload.statistics.totalSubmissions}
                reviews={payload.statistics.reviews}
                totalReviews={payload.statistics.totalReviews}
              />
            </Grid>
          )}

          {payload.grades && payload.grades.length > 0 && (
            <>
              <Grid item xs={12} lg={9} >
                <FinalGradesGraph
                  grades={payload.grades}
                />
              </Grid>

              <Grid item xs={12} lg={3} >
                <GradeColumnChart
                  grades={payload.grades}
                />
              </Grid>
            </>

          )}

          {((payload.confidenceFactors && payload.confidenceFactors.length > 0) || (payload.currentConfidenceFactors && payload.currentConfidenceFactors.length > 0)) && (
            <Grid item xs={12} lg={9} >
              <СoefficientsFactorGraph
                confidenceFactors={payload.confidenceFactors}
                currentConfidenceFactors={payload.currentConfidenceFactors}
              />
            </Grid>
          )}
        </Grid>
      )}
    </DashboardWorkBox >
  )
}