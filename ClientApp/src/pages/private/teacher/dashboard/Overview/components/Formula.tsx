
import { FC } from "react";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { Equation } from "react-equation";


interface IProps {
  submissionWeight: number,
  reviewWeight: number,
  badCoefficientPenalty?: number,
  goodCoefficientBonus?: number,
}

export const Formula: FC<IProps> = ({
  submissionWeight,
  reviewWeight,
  badCoefficientPenalty,
  goodCoefficientBonus
}) => {
  const gradeFinal = 'F'
  const gradeSubmission = 'S'
  const gradeReview = 'R'
  const gradeBonusPenalty = 'K'

  const formulaByWeights = `${gradeFinal} = ${gradeSubmission} * ${submissionWeight}% + ${gradeReview} * ${reviewWeight}%`
  const formulaBunusOrPenalty = typeof badCoefficientPenalty === 'number' || typeof goodCoefficientBonus === 'number' ? ` ± ${gradeBonusPenalty}` : ""
  const result = " ≤ 10"
  const zero = "0 ≤ "

  const finalFormula = zero + formulaByWeights + formulaBunusOrPenalty + result

  return (
    <Box sx={styles.wrapper}>
      <Typography variant={'h6'}>
        {"Формула для расчета итоговой оценки"}
      </Typography>
      <Box margin={"auto 0"}>
        <Box textAlign={"center"}>
          <Equation
            style={{ fontSize: "21px" }}
            value={finalFormula}
          />
        </Box>

        <Typography
          variant={'body1'}
          whiteSpace={"pre-line"}
          textAlign={"center"}
        >
          <Equation value={gradeFinal} />
          {" -- итоговая оценка."}
          <br />

          <Equation value={gradeSubmission} />
          {" -- оценка за работу. "}
          <br />

          <Equation value={gradeReview} />
          {" -- оценка за проверку. "}
          <br />

          {(badCoefficientPenalty || goodCoefficientBonus) && (
            <>
              <Equation value={gradeBonusPenalty} />
              {" --  бонус или штраф за "}
              <b>{"текущий"}</b>
              {" коэф. доверия. Если у студента текущий коэф. доверия меньше чем 0.35, то будет штраф "}
              <b>{typeof badCoefficientPenalty === 'number' ? `${badCoefficientPenalty}.` : "-0."}</b>

              {" Если у студента текущий коэф. доверия больше чем 0.75, то будет бонус  "}
              <b>{typeof goodCoefficientBonus === 'number' ? `+${goodCoefficientBonus}.` : "+0."}</b>
            </>
          )}
        </Typography>
      </Box>
    </Box >
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '8px',
    padding: '20px 15px',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px",
    flexDirection: "column",
  } as SxProps<Theme>,
}