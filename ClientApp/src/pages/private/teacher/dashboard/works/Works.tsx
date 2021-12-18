import { FC, useCallback, useEffect, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Button, Typography } from "@mui/material";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import { WorksList } from "./WorksList";
import { WorkResponse } from "./WorkResponse";

import { IWorkItem } from "../../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { fetchWorks } from "../../../../../store/works";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";


export const Works: FC = () => {

  const dispatch = useAppDispatch()

  const isWorkListLoading = useAppSelector(state => state.works.isWorkListLoading)
  const isWorkListLock = useAppSelector(state => state.works.isWorkListLock)
  const workList = useAppSelector(state => state.works.workList)
  const error = useAppSelector(state => state.works.error)

  const { path } = usePrivatePathTDashboard()

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchWorks(path.taskId))
  }, [path])

  useEffect(() => {
    if (workList && workList.length > 0 && !activeWork) {
      const defaultSelectedWork = workList[0]
      requestWorkResponsesById(defaultSelectedWork.workId)
      setActiveWork(JSON.parse(JSON.stringify(defaultSelectedWork)))
    }
  }, [workList])

  const requestWorkResponsesById = useCallback((workId: string) => {

  }, [])

  const [activeWork, setActiveWork] = useState<IWorkItem>()

  const handleOnWorkChange = useCallback((workId: string) => {
    if (workList && workList.length > 0) {
      const workItem = workList.find(work => work.workId === workId)
      if (workItem) {
        setActiveWork(
          JSON.parse(JSON.stringify(workItem))
        )
      }
    }
  }, [activeWork, workList])

  return (
    <DashboardWorkBox
      isLoading={isWorkListLoading}
      isLock={isWorkListLock}
      error={error}
    >
      {workList && workList.length > 0 && activeWork &&(
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

            <WorkResponse responses={[]} />
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