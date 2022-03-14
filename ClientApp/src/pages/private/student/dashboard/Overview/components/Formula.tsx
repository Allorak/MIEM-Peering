
import { FC } from "react";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { Equation } from "react-equation";


interface IProps {
  submissionGrade?: number,
  reviewGrade?: number,
  finalGrade?: number,
  submissionWeight: number,
  reviewWeight: number,
  badCoefficientPenalty?: number,
  goodCoefficientBonus?: number,
  coefficientBefore?: number
}

export const Formula: FC<IProps> = ({
  submissionGrade,
  reviewGrade,
  finalGrade,
  submissionWeight,
  reviewWeight,
  badCoefficientPenalty,
  goodCoefficientBonus,
  coefficientBefore
}) => {
  const gradeFinal = 'F'
  const gradeSubmission = 'S'
  const gradeReview = 'R'
  const gradeBonusPenalty = 'K'

  const formulaByWeights = `${gradeFinal} = ${gradeSubmission} * ${submissionWeight}% + ${gradeReview} * ${reviewWeight}%`
  const formulaBunusOrPenalty = typeof badCoefficientPenalty === 'number' || typeof goodCoefficientBonus === 'number' ? ` ± ${gradeBonusPenalty}` : ""
  const result = typeof finalGrade === 'number' ? ` ≈ ${finalGrade}` : " ≤ 10"
  const zero = typeof finalGrade === 'number' ? "" : `0 ≤ `

  const finalFormula = zero + formulaByWeights + formulaBunusOrPenalty + result

  return (
    <Box sx={styles.wrapper}>
      <Typography variant={'h6'}>
        {typeof finalGrade === 'number' ? "Итоговая оценка" : "Формула"}
      </Typography>

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
        {" -- итоговая оценка. "}
        {typeof finalGrade === 'number' && (<b>{finalGrade}</b>)}
        <br />

        <Equation value={gradeSubmission} />
        {" -- оценка за работу. "}
        {typeof submissionGrade === 'number' && (<b>{submissionGrade}</b>)}
        <br />

        <Equation value={gradeReview} />
        {" -- оценка за проверку. "}
        {typeof reviewGrade === 'number' && (<b>{reviewGrade}</b>)}
        <br />

        {(badCoefficientPenalty || goodCoefficientBonus) && typeof coefficientBefore === 'number' && (
          <>
            <Equation value={gradeBonusPenalty} />
            {" --  бонус или штраф за "}
            <b>{"текущий"}</b>
            {" коэф. доверия. Ваш текущий коэф.: "}
            <b>{`${coefficientBefore}. `}</b>
            {coefficientBefore < 0.35 && (
              <>
                {"У вас плохой текущий коэф. доверия (меньше чем "}
                <b> {"0.35"}</b >
                {` ). Штраф ${typeof badCoefficientPenalty === 'number' ? `${badCoefficientPenalty}` : "-0"}`}
              </>
            )}

            {coefficientBefore > 0.75 && (
              <>
                {"У вас хороший текущий коэф. доверия (больше чем "}
                <b> {"0.75"}</b >
                {" ). Бонус "}
                <b>{typeof goodCoefficientBonus === 'number' ? `+${goodCoefficientBonus}` : "+0"}</b>
              </>
            )}

            {coefficientBefore >= 0.35 && coefficientBefore <= 0.75 && (
              <>
                {"У вас средний текущий коэф. доверия (больше чем "}
                <b> {"0.35"}</b >
                {" и меньше чем "}
                <b> {"0.75"}</b >
                {"). Бонус/штраф "}
                <b>{"отсутствует."}</b>
              </>
            )}
          </>
        )}
      </Typography>
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
    flexDirection: "column"
  } as SxProps<Theme>,
}