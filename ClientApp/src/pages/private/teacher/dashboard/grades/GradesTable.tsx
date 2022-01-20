import { FC, useMemo } from "react";
import { Box, TableBody, TableHead, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";

import { IGrades, ReviewQualities } from "../../../../../store/types";


interface IProps {
  grades: IGrades[]
}

interface IFoundCells {
  nextConfidenceFactor: boolean
  assignedSubmissions: boolean
  reviewedSubmissions: boolean
  finalGrade: boolean
  reviewQuality: boolean
}

export const GradesTable: FC<IProps> = ({ grades }) => {

  const cells: IFoundCells = useMemo(() => {
    const foundCells = {
      nextConfidenceFactor: false,
      assignedSubmissions: false,
      reviewedSubmissions: false,
      finalGrade: false,
      reviewQuality: false
    }

    for (const item of grades) {
      if (typeof item.nextConfidenceFactor === 'number') {
        foundCells.nextConfidenceFactor = true
      }

      if (typeof item.assignedSubmissions === 'number') {
        foundCells.assignedSubmissions = true
      }

      if (typeof item.reviewedSubmissions === 'number') {
        foundCells.reviewedSubmissions = true
      }

      if (typeof item.finalGrade === 'number') {
        foundCells.finalGrade = true
      }

      if (typeof item.reviewQuality === 'number') {
        foundCells.reviewQuality = true
      }
    }

    return foundCells
  }, [grades])



  return (
    <Table sx={styles.tableContainer}>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>{heads.strudent}</TableHeadCell>

          <TableHeadCell>{heads.submitted}</TableHeadCell>

          {cells.finalGrade && (
            <TableHeadCell>{heads.finalGrade}</TableHeadCell>
          )}

          <TableHeadCell>{heads.teacherReviewed}</TableHeadCell>

          {cells.reviewQuality && (
            <TableHeadCell>{heads.reviewQuality}</TableHeadCell>
          )}

          {cells.assignedSubmissions && (
            <TableHeadCell>{heads.assignedSubmissions}</TableHeadCell>
          )}

          {cells.reviewedSubmissions && (
            <TableHeadCell>{heads.reviewedSubmissions}</TableHeadCell>
          )}

          <TableHeadCell>{heads.previousConfidenceFactor}</TableHeadCell>

          {cells.nextConfidenceFactor && (
            <TableHeadCell>{heads.nextConfidenceFactor}</TableHeadCell>
          )}
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {grades.map((studentItem, index) => (
          <GradeRow
            key={index}
            studentItem={studentItem}
            flags={cells}
          />
        ))}
      </TableBody>
    </Table>
  )
}

interface IPropsRow {
  studentItem: IGrades
  flags: IFoundCells
}

const GradeRow: FC<IPropsRow> = ({ studentItem, flags }) => {
  return (
    <TableBodyRow>
      <TableBodyCellUser name={studentItem.fullname} img={studentItem.imageUrl} />

      <TableBodyCell isCentered>
        <DecoratedText
          color={studentItem.submitted ? "success.main" : "error.main"}
          label={studentItem.submitted ? "Сдана" : "Не сдана"}
        />
      </TableBodyCell>

      {flags.finalGrade && (
        <TableBodyCell isRight>
          {typeof studentItem.finalGrade === 'number' ? studentItem.finalGrade.toFixed(1) : "---"}
        </TableBodyCell>
      )}

      <TableBodyCell isCentered>
        <DecoratedText
          color={studentItem.teacherReviewed ? "success.main" : "warning.main"}
          label={studentItem.teacherReviewed ? "Сдана" : "Не сдана"}
        />
      </TableBodyCell>

      {flags.reviewQuality && (
        <TableBodyCell isCentered>
          {studentItem.reviewQuality && (
            <DecoratedText
              color={studentItem.reviewQuality === ReviewQualities.GOOD ? "success.main" : studentItem.reviewQuality === ReviewQualities.DECENT ? "warning.main" : "error.main"}
              label={studentItem.reviewQuality === ReviewQualities.GOOD ? "Лучшая" : studentItem.reviewQuality === ReviewQualities.DECENT ? "Средняя" : "Плохая"}
            />
          )}
        </TableBodyCell>
      )}

      {flags.assignedSubmissions && (
        <TableBodyCell isRight>
          {typeof studentItem.assignedSubmissions === 'number' && (
            studentItem.assignedSubmissions
          )}
        </TableBodyCell>
      )}

      {flags.reviewedSubmissions && (
        <TableBodyCell isRight>
          {typeof studentItem.reviewedSubmissions === 'number' && (
            studentItem.reviewedSubmissions
          )}
        </TableBodyCell>
      )}

      <TableBodyCell isCentered>
        <Typography variant={"body1"}>
          {studentItem.previousConfidenceFactor.toFixed(2)}
        </Typography>
      </TableBodyCell>

      {flags.nextConfidenceFactor && (
        <TableBodyCell isCentered>
          {typeof studentItem.nextConfidenceFactor === 'number' && (
            <Typography variant={"body1"} color={"secondary.main"}>
              {studentItem.nextConfidenceFactor.toFixed(2)}
            </Typography>
          )}
        </TableBodyCell>
      )}
    </TableBodyRow>
  )
}

const DecoratedText: FC<{ color: string, label: string }> = ({ color, label }) => {
  return (
    <Box sx={{ ...styles.textDecorationContainer, backgroundColor: color, color }}>
      <Typography variant={"body1"} color={"inherit"}>
        {label}
      </Typography>
    </Box>
  )
}


const styles = {
  tableContainer: {
    margin: "0px auto",
    // maxWidth: "900px",
    width: "100%"
  } as SxProps<Theme>,
  textDecorationContainer: {
    lineHeight: "18px",
    opacity: 0.5,
    padding: "6px 7px",
    borderRadius: "2px"
  } as SxProps<Theme>,
}


const heads = {
  strudent: "Студент",
  previousConfidenceFactor: "Коэф. доверия до задания",
  nextConfidenceFactor: "Результирующий коэф. доверия",
  submitted: "Сдача работ",
  assignedSubmissions: "Назначено работ",
  reviewedSubmissions: "Проверено",
  teacherReviewed: "Проверено преподавателем",
  finalGrade: "Оценка за работу",
  reviewQuality: "Качество проверки"
}