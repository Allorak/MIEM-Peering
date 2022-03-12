import { FC, useMemo } from "react";
import { Box, TableBody, TableHead, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Zoom from '@mui/material/Zoom';

import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";

import { IGrades, ReviewQualities } from "../../../../../store/types";
import { palette } from "../../../../../theme/colors";


interface IProps {
  grades: IGrades[]
}

interface IFoundCells {
  nextConfidenceFactor: boolean
  assignedSubmissions: boolean
  reviewedSubmissions: boolean
  finalGrade: boolean
  reviewQuality: boolean
  reviewGrade: boolean
  submissionGrade: boolean
}

export const GradesTable: FC<IProps> = ({ grades }) => {

  const cells: IFoundCells = useMemo(() => {
    const foundCells = {
      nextConfidenceFactor: false,
      assignedSubmissions: false,
      reviewedSubmissions: false,
      finalGrade: false,
      reviewQuality: false,
      reviewGrade: false,
      submissionGrade: false
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

      if (item.reviewQuality) {
        foundCells.reviewQuality = true
      }

      if (typeof item.reviewGrade === 'number') {
        foundCells.reviewGrade = true
      }

      if (typeof item.submissionGrade === 'number') {
        foundCells.submissionGrade = true
      }
    }

    return foundCells
  }, [grades])



  return (
    <Table sx={{ margin: "0 auto" }}>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>{heads.strudent}</TableHeadCell>

          <TableHeadCell>{heads.submitted}</TableHeadCell>

          {cells.submissionGrade && (
            <TableHeadCell>{heads.submissionGrade}</TableHeadCell>
          )}

          {cells.reviewGrade && (
            <TableHeadCell>{heads.reviewGrade}</TableHeadCell>
          )}

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
      <TableBodyCellUser
        name={studentItem.fullname}
        img={studentItem.imageUrl}
        email={studentItem.email}
        receivedLtiGrade={studentItem.receivedLtiGrade}
        joinedByLti={studentItem.joinedByLti}
      />

      <TableBodyCell isCentered>
        <DecoratedText
          type={studentItem.submitted ? "success" : "error"}
          label={studentItem.submitted ? "Сдана" : "Не сдана"}
        />
      </TableBodyCell>

      {flags.submissionGrade && (
        <TableBodyCell isCentered>
          {typeof studentItem.submissionGrade === 'number' ? (
            <>
              {studentItem.reviewQuality !== ReviewQualities.NOT_REVIEWED ? (
                <Typography
                  variant={"body1"}
                  color={"success.main"}
                  fontWeight={400}
                >
                  {studentItem.submissionGrade.toFixed(1)}
                </Typography>
              ) : (
                <Tooltip
                  title={<span style={{ whiteSpace: 'pre-line' }}>{"К сожалению, данную работу не проверил ни один пир из тех, кому она была назначена.\n\nНеобходима проверка преподавателя!"}</span>}
                  placeholder={"top"}
                  arrow
                  enterDelay={0}
                  leaveDelay={0}
                  TransitionComponent={Zoom}
                >
                  <Box color={'error.main'}>
                    <InfoOutlinedIcon color={'inherit'} />
                  </Box>
                </Tooltip>
              )}
            </>
          ) : "---"}
        </TableBodyCell>
      )}

      {flags.reviewGrade && (
        <TableBodyCell isCentered>
          {typeof studentItem.reviewGrade === 'number' ? (
            <Typography
              variant={"body1"}
              color={"info.main"}
              fontWeight={400}
            >
              {studentItem.reviewGrade.toFixed(1)}
            </Typography>
          ) : "---"}
        </TableBodyCell>
      )}

      {flags.finalGrade && (
        <TableBodyCell isCentered>
          {typeof studentItem.finalGrade === 'number' ? (
            <>
              {studentItem.reviewQuality !== ReviewQualities.NOT_REVIEWED ? (
                <Typography
                  variant={"body1"}
                  color={"primary.main"}
                  fontWeight={700}
                  sx={{ textDecoration: "underline" }}
                >
                  {studentItem.gradeComment ? (
                    <Tooltip
                      title={<span style={{ whiteSpace: 'pre-line' }}>{studentItem.gradeComment}</span>}
                      placeholder={"top"}
                      arrow
                      enterDelay={0}
                      leaveDelay={0}
                      TransitionComponent={Zoom}
                    >
                      <Box>
                        {studentItem.finalGrade.toFixed(1)}
                      </Box>
                    </Tooltip>
                  ) : (
                    <>{studentItem.finalGrade.toFixed(1)}</>
                  )}

                </Typography>
              ) : (
                <Tooltip
                  title={<span style={{ whiteSpace: 'pre-line' }}>{"К сожалению, данную работу не проверил ни один пир из тех, кому она была назначена.\n\nНеобходима проверка преподавателя!"}</span>}
                  placeholder={"top"}
                  arrow
                  enterDelay={0}
                  leaveDelay={0}
                  TransitionComponent={Zoom}
                >
                  <Box color={'error.main'}>
                    <InfoOutlinedIcon color={'inherit'} />
                  </Box>
                </Tooltip>
              )}
            </>

          ) : "---"}
        </TableBodyCell>
      )}

      <TableBodyCell isCentered>
        <DecoratedText
          type={studentItem.teacherReviewed ? "success" : "warning"}
          label={studentItem.teacherReviewed ? "Да" : "Нет"}
        />
      </TableBodyCell>

      {flags.reviewQuality && (
        <TableBodyCell isCentered>
          {studentItem.reviewQuality && (
            <>
              {studentItem.reviewQuality !== ReviewQualities.NOT_REVIEWED ? (
                <DecoratedText
                  type={studentItem.reviewQuality === ReviewQualities.GOOD ? "success" : studentItem.reviewQuality === ReviewQualities.DECENT ? "warning" : "error"}
                  label={studentItem.reviewQuality === ReviewQualities.GOOD ? "Лучшая" : studentItem.reviewQuality === ReviewQualities.DECENT ? "Средняя" : "Плохая"}
                />
              ) : (
                <>
                  {"--"}
                </>
              )}
            </>

          )}
        </TableBodyCell>
      )}

      {flags.assignedSubmissions && (
        <TableBodyCell isCentered>
          {typeof studentItem.assignedSubmissions === 'number' && (
            studentItem.assignedSubmissions
          )}
        </TableBodyCell>
      )}

      {flags.reviewedSubmissions && (
        <TableBodyCell isCentered>
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
            <>
              {studentItem.reviewQuality !== ReviewQualities.NOT_REVIEWED ? (
                <Typography
                  variant={"body1"}
                  color={"secondary.main"}
                  fontWeight={700}
                  sx={{ textDecoration: "underline" }}
                >
                  {studentItem.confidenceComment ? (
                    <Tooltip
                      title={<span style={{ whiteSpace: 'pre-line' }}>{studentItem.confidenceComment}</span>}
                      placeholder={"top"}
                      arrow
                      enterDelay={0}
                      leaveDelay={0}
                      TransitionComponent={Zoom}
                    >
                      <Box>

                        {studentItem.nextConfidenceFactor.toFixed(2)}
                      </Box>
                    </Tooltip>
                  ) : (
                    <>{studentItem.nextConfidenceFactor.toFixed(2)}</>
                  )}
                </Typography>
              ) : (
                <Tooltip
                  title={<span style={{ whiteSpace: 'pre-line' }}>{"К сожалению, данную работу не проверил ни один пир из тех, кому она была назначена.\n\nНеобходима проверка преподавателя!"}</span>}
                  placeholder={"top"}
                  arrow
                  enterDelay={0}
                  leaveDelay={0}
                  TransitionComponent={Zoom}
                >
                  <Box color={'error.main'}>
                    <InfoOutlinedIcon color={'inherit'} />
                  </Box>
                </Tooltip>
              )}
            </>
          )}
        </TableBodyCell>
      )}
    </TableBodyRow>
  )
}

const DecoratedText: FC<{ type: 'success' | 'error' | 'warning', label: string }> = ({ type, label }) => {

  const colors = {
    color: type === 'success' ? palette.fill.success : type === 'error' ? palette.fill.danger : palette.fill.secondary,
    backgroundColor: type === 'success' ? palette.transparent.success : type === 'error' ? palette.transparent.warning : palette.transparent.secondary
  }

  return (
    <Typography
      variant={"body1"}
      sx={{ ...styles.textDecoration, color: colors.color, backgroundColor: colors.backgroundColor }}
    >
      {label}
    </Typography>
  )
}


const styles = {
  textDecoration: {
    lineHeight: "28px",
    padding: "0px 7px",
    borderRadius: "5px",
    display: "inline-block"
  } as SxProps<Theme>,
}


const heads = {
  strudent: "Студент",
  previousConfidenceFactor: "Коэф. доверия до задания",
  nextConfidenceFactor: "Итоговый коэф. доверия",
  submitted: "Сдача работ",
  assignedSubmissions: "Назначено работ",
  reviewedSubmissions: "Проверено",
  teacherReviewed: "Проверено преподавателем",
  submissionGrade: "Оценка за работу",
  reviewGrade: "Оценка за проверку",
  finalGrade: "Итоговая оценка",
  reviewQuality: "Качество проверки"
}