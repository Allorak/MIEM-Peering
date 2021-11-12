import { FC, useCallback, useEffect, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Button, Typography } from "@mui/material";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import { WorksList } from "./WorksList";
import { WorkResponse } from "./WorkResponse";

import { IWorkItem, IWorkResponse } from "../../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";
import { fetchWorks } from "../../../../../store/works";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";


export const Works: FC = () => {

  const dispatch = useAppDispatch()

  const isLoading = useAppSelector(state => state.works.isLoading)
  const isLock = useAppSelector(state => state.works.isLock)
  const payload = useAppSelector(state => state.works.payload)
  const error = useAppSelector(state => state.works.error)

  const { path } = usePrivatePathTDashboard()

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchWorks(path.taskId))
  }, [])

  const [activeWork, setActiveWork] = useState<IWorkItem>()

  const handleOnWorkChange = useCallback((workId: string) => {
    if (payload && payload.length > 0) {
      const workItem = payload.find(work => work.id === workId)
      if (workItem) {
        setActiveWork(
          JSON.parse(JSON.stringify(workItem))
        )
      }
    }
  }, [activeWork, setActiveWork, payload])

  return (
    <DashboardWorkBox
      isLoading={isLoading}
      isLock={isLock}
      error={error}
    >
      {payload && payload.length > 0 && (
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
                  {activeWork ? activeWork.author.name : payload[0].author.name}
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

            <WorkResponse
              responses={JSON.parse(JSON.stringify(activeWork ? activeWork.responses : payload[0].responses))}
            />
          </Box>

          <Box sx={styles.rightContainer}>
            <WorksList
              worksCatalog={payload}
              activeWorkId={activeWork ? activeWork.id : payload[0].id}
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