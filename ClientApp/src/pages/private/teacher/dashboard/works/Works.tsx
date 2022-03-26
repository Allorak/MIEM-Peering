import React from "react";
import { FC, useCallback, useEffect, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Button, Grid, Typography, useMediaQuery } from "@mui/material";
import Slide from '@mui/material/Slide';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { TransitionProps } from '@mui/material/transitions';


import { WorkResponse } from "./WorkResponse";
import { WorkStatistics } from "./WorkStatistics";

import { fetchWorkList, fetchStudentWork, fetchStudentWorkStatistics } from "../../../../../store/works";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { Popup } from "../../../../../components/popup";
import { NoData } from "../../../../../components/noData";
import { WorksList } from "../../../../../components/workList";

import { useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { IError, IStudentWork, IWorkItem, IWorks, IWorkStatistics, Reviewers, WorkGraphTypes, WorkStatisticsTypes } from "../../../../../store/types";

import * as globalStyles from "../../../../../const/styles";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Works: FC = () => {

  const matches = useMediaQuery('(max-width:899px)');

  const { path } = usePrivatePathTDashboard()

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const [isWorkListLoading, setWorkListLoading] = useState(false)
  const [workList, setWorkList] = useState<IWorks>()

  const [isStudentWorkLoading, setStudentWorkLoading] = useState(false)
  const [studentWork, setStudentWork] = useState<IStudentWork>()

  const [isStudentWorkStatisticLoading, setStudentWorkStatisticLoading] = useState(false)
  const [workStatistics, setWorkStatistics] = useState<IWorkStatistics | null>()

  const [error, setError] = useState<IError>()

  const [activeWork, setActiveWork] = useState<IWorkItem>()
  const [popupStatus, setPopupStatus] = useState<boolean>(false)

  useEffect(() => {
    getWorkList()
  }, [])

  useEffect(() => {
    if (workList && workList.submissionsInfo.length > 0) {
      const defaultWork = workList.submissionsInfo[0]
      setActiveWork(defaultWork)
      getStudentWork(defaultWork.submissionId)
    }
  }, [workList])

  const getWorkList = useCallback(() => {
    if (path && path.taskId && accessToken) {
      setWorkListLoading(true)
      fetchWorkList(path.taskId, accessToken).then(response => {
        if (response.success) {
          setWorkList(JSON.parse(JSON.stringify(response.payload ?? { submissionsInfo: [] })))
        } else {
          setError(response.error)
          setWorkList(undefined)
        }
        setWorkListLoading(false)
      })
    }
  }, [path?.taskId, accessToken])

  const getStudentWork = useCallback((workId: string) => {
    if (path && path.taskId && accessToken) {
      setStudentWorkLoading(true)
      fetchStudentWork(path.taskId, workId, accessToken).then(response => {
        if (response.success) {
          setStudentWork(JSON.parse(JSON.stringify({
            responses: response.payload.answers
          })))
        } else {
          setError(response.error)
          setStudentWork(undefined)
        }
        setStudentWorkLoading(false)
      })
    }
  }, [accessToken, path?.taskId])

  const getWorkStatistics = useCallback((workId: string) => {
    if (path && path.taskId && accessToken) {
      setStudentWorkStatisticLoading(true)
      fetchStudentWorkStatistics(path.taskId, workId, accessToken).then(response => {
        if (response.success) {
          setWorkStatistics(JSON.parse(
            JSON.stringify(response.payload.statistics ?? [])
          ))
        } else {
          setError(response.error)
          setWorkStatistics(undefined)
        }
        setStudentWorkStatisticLoading(false)
      })
    }
  }, [path?.taskId, accessToken])

  const handleOnStatistics = useCallback(() => {
    if (path && path.taskId && activeWork) {
      setPopupStatus(prev => !prev)
      getWorkStatistics(activeWork.submissionId)
    }
  }, [activeWork])

  const handleOnWorkChange = useCallback((workId: string) => {
    if (workList && workList.submissionsInfo.length > 0 && activeWork && activeWork.submissionId !== workId) {
      const workItem = workList.submissionsInfo.find(work => work.submissionId === workId)
      if (workItem) {
        setActiveWork(
          JSON.parse(JSON.stringify(workItem))
        )
        getStudentWork(workItem.submissionId)
      }
    }
  }, [activeWork, workList])

  return (
    <DashboardWorkBox
      isLoading={isWorkListLoading}
      error={error}
    >
      {workList && workList.submissionsInfo.length > 0 && activeWork && (
        <Grid container spacing={{ xs: "5px", md: "10px", lg: "25px" }} direction={matches ? 'row' : 'row-reverse'}>
          <Grid item xs={12} md={2}>
            <WorksList
              worksCatalog={workList.submissionsInfo}
              activeWorkId={activeWork.submissionId}
              onWorkChange={handleOnWorkChange}
            />
          </Grid>
          <Grid item xs={12} md={10}>
            <Box sx={styles.topActionBox}>
              <Typography
                variant={"body1"}
                sx={styles.subTitle}
              >
                {'Работа студента: '}

                <Typography
                  variant={"h6"}
                  color={'inherit'}
                  component={'span'}
                >
                  {activeWork.studentName}
                </Typography>
              </Typography>

              <Button
                variant={"contained"}
                color={"primary"}
                startIcon={<QueryStatsIcon sx={{ margin: "0px -8px 0px 0px" }} />}
                sx={styles.metaDataBt}
                onClick={handleOnStatistics}
              >
                {"Метаданные"}
              </Button>
            </Box>

            <DashboardWorkBox
              isLoading={isStudentWorkLoading}
              error={error}
            >
              {studentWork && (
                <WorkResponse responses={studentWork} />
              )}
            </DashboardWorkBox>
          </Grid>
        </Grid>
      )}

      {activeWork && (
        <Popup
          title={`Метаданные результатов проверки: ${activeWork.studentName}`}
          open={popupStatus}
          loading={isStudentWorkStatisticLoading}
          onCloseHandler={setPopupStatus}
          fullScreen
          fullWidth
          PaperProps={{ sx: { flex: '0 1 100%' } }}
          dialogContentSx={{ padding: "0px 10px", ...globalStyles.scrollStyles, backgroundColor: "#F5F7FD" }}
          TransitionComponent={Transition}
          transitionDuration={100}
        >
          {workStatistics && workStatistics.length > 0 && (
            <WorkStatistics workStatistics={workStatistics} />
          )}

          {workStatistics && workStatistics.length === 0 && (
            <NoData label={"Данную работу еще не оценили"} />
          )}
        </Popup>
      )}

      {workList && workList.submissionsInfo.length === 0 && (
        <NoData label={"Пока никто не сдал работу..."} />
      )}
    </DashboardWorkBox>
  )
}

const styles = {
  topActionBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0px 0px 20px 0px",
    '@media (max-width: 899px)': {
      margin: "0px 0px 10px 0px",
    }
  } as SxProps<Theme>,
  metaDataBt: {
    padding: "8px 20px",
    '@media (max-width: 899px)': {
      flex: "1 1 100%"
    }
  } as SxProps<Theme>,
  subTitle: {
    '@media (max-width: 899px)': {
      display: "none",
      opacity: 0,
      width: "0px",
      height: "0px"
    }
  } as SxProps<Theme>,
}