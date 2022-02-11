import { FC, useCallback, useEffect } from "react";
import { Box, Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathTDashboard } from "../../../../../app/hooks/usePrivatePathTDashboard";

import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { NoData } from "../../../../../components/noData";

import { fetchCsv, fetchExel, fetchGrades } from "../../../../../store/grades";

import { GradesTable } from "./GradesTable";


export const Grades: FC = () => {
  const dispatch = useAppDispatch()

  const { path } = usePrivatePathTDashboard()

  const status = useAppSelector(state => state.grades.isLoading)
  const error = useAppSelector(state => state.grades.error)
  const grades = useAppSelector(state => state.grades.payload)
  const accessToken = useAppSelector(state => state.auth.accessToken)

  useEffect(() => {
    if (path && path.taskId)
      dispatch(fetchGrades(path.taskId))
  }, [])

  const getExel = async () => {
    if (path && path.taskId && accessToken) {
      fetchExel(path.taskId, accessToken)
    }
  }

  const handleDownloadExel = useCallback(() => {
    if (path && path.taskId && accessToken) {
      fetchExel(path.taskId, accessToken).then(blob => {
        if (blob) {
          saveAs(blob, "MIEM Peering Final Grades")
        }
      })
    }
  }, [getExel, path, accessToken])

  const handleDownloadCsv = useCallback(() => {
    if (path && path.taskId && accessToken) {
      fetchCsv(path.taskId, accessToken).then(blob => {
        if (blob) {
          saveAs(blob, "MIEM Peering Final Grades.csv")
        }
      })
    }
  }, [getExel, path, accessToken])

  return (
    <DashboardWorkBox
      isLoading={status}
      error={error}
    >
      {grades && grades.length > 0 && (
        <>
          <Box sx={styles.buttonContainer}>
            <Button
              variant={'contained'}
              color={'primary'}
              startIcon={<DownloadIcon />}
              sx={styles.downlaodBt}
              onClick={handleDownloadExel}
            >
              {"Excel"}
            </Button>

            <Button
              variant={'contained'}
              color={'secondary'}
              startIcon={<DownloadIcon />}
              sx={styles.downlaodBt}
              onClick={handleDownloadCsv}
            >
              {"CSV"}
            </Button>
          </Box>
          <GradesTable grades={grades} />
        </>
      )}

      {grades && grades.length === 0 && (
        <NoData label={"Нет данных"} />
      )}
    </DashboardWorkBox>
  )
}

const styles = {
  downlaodBt: {
    padding: '10px 30px 10px 10px',
    lineHeight: '1',
  } as SxProps<Theme>,
  buttonContainer: {
    display: "flex",
    gap: "10px",
    margin: "0px 0px 20px 0px",
    justifyContent: "flex-end"
  } as SxProps<Theme>,
}