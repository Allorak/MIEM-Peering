import { FC, useCallback, useEffect, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Button, Typography } from "@mui/material";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import { WorksList } from "./WorksList";
import { WorkResponse } from "./WorkResponse";

import { IWorkItem } from "../../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { fetchWorkList, fetchStudentWork } from "../../../../../store/works";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";


export const Works: FC = () => {

  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const isWorkListLoading = useAppSelector(state => state.works.isWorkListLoading)
  const isWorkListLock = useAppSelector(state => state.works.isWorkListLock)
  const isStudentWorkLoading = useAppSelector(state => state.works.isStudentWorkLoading)
  const isStudentWorkLock = useAppSelector(state => state.works.isStudentWorkLock)
  const workList = useAppSelector(state => state.works.workList)
  const studentWork = useAppSelector(state => state.works.studentWork)
  const error = useAppSelector(state => state.works.error)

  const [activeWork, setActiveWork] = useState<IWorkItem>()

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchWorkList(path.taskId))
  }, [])

  useEffect(() => {
    if (workList && workList.length > 0 && !activeWork) {
      const defaultSelectedWork = workList[0]
      requestWorkResponsesById(defaultSelectedWork.workId)
      setActiveWork(JSON.parse(JSON.stringify(defaultSelectedWork)))
    }
  }, [workList])

  const requestWorkResponsesById = useCallback((workId: string) => {
    if (path && path.taskId)
      dispatch(fetchStudentWork(path.taskId, workId))
  }, [path])

  const handleOnWorkChange = useCallback((workId: string) => {
    if (workList && workList.length > 0) {
      const workItem = workList.find(work => work.workId === workId)
      if (workItem) {
        setActiveWork(
          JSON.parse(JSON.stringify(workItem))
        )
        requestWorkResponsesById(workItem.workId)
      }
    }
  }, [activeWork, workList])

  return (
    <DashboardWorkBox
      isLoading={isWorkListLoading}
      isLock={isWorkListLock}
      error={error}
    >
      {workList && workList.length > 0 && activeWork && (
        <Box sx={styles.gridContainer}>
          <Box sx={styles.leftContainer}>
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
                startIcon={<BorderColorTwoToneIcon sx={{ margin: "0px -8px 0px 0px" }} />}
                sx={styles.addBt}
              >
                {"Оценить"}
              </Button>
            </Box>

            <DashboardWorkBox
              isLoading={isStudentWorkLoading}
              isLock={isStudentWorkLock}
              error={error}
            >
              {studentWork && (
                <WorkResponse responses={studentWork} />
              )}
            </DashboardWorkBox>
          </Box>

          <Box sx={styles.rightContainer}>
            <WorksList
              worksCatalog={workList}
              activeWorkId={activeWork.workId}
              onWorkChange={handleOnWorkChange}
            />
          </Box>
        </Box>
      )}

    </DashboardWorkBox>
  )
}

const styles = {
  gridContainer: {
    display: "flex",
    gap: "25px",
    width: "100%",
    alignItems: "flex-start",
    '@media (max-width: 900px)': {
      flexDirection: "column-reverse",
      gap: "10px",
    }
  } as SxProps<Theme>,
  leftContainer: {
    flex: "1 1 100%",
    '@media (max-width: 900px)': {
      flex: "1 1 auto",
      width: "100%"
    }
  } as SxProps<Theme>,
  rightContainer: {
    flex: "0 0 230px",
    '@media (max-width: 900px)': {
      flex: "1 1 auto",
      width: "100%"
    }
  } as SxProps<Theme>,
  topActionBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0px 0px 20px 0px"
  } as SxProps<Theme>,
  addBt: {
    padding: "8px 20px",
    '@media (max-width: 900px)': {
      flex: "1 1 100%"
    }
  } as SxProps<Theme>,
  subTitle: {
    '@media (max-width: 900px)': {
      display: "none",
      opacity: 0,
      width: "0px",
      height: "0px"
    }
  } as SxProps<Theme>,
}