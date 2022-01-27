import { FC, useMemo } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { PeerSteps } from "../../store/types";

interface IProps {
  step: PeerSteps
}

export const StepCheckBlock: FC<IProps> = ({ step }) => {
  const cardData = useMemo(() => {
    switch (step) {
      case PeerSteps.FIRST_STEP:
        return {
          stepTitle: "Начальный этап",
          stepDescription: 'Задания начального этапа предназначены для определения коэффициентов доверия студентов курса. Это достигается при помощи привлечения экспертов, и в итоговых оценках за это задание учитывается только их проверка.'
        }
      case PeerSteps.SECOND_STEP:
        return {
          stepTitle: "Основной этап",
          stepDescription: 'Задания основного этапа являются обычными заданиями, где используются только проверки студентов и их коэффициенты доверия (изначально полученные в задании начального типа). По результатам проверок коэффициенты доверия студентов корректируются автоматически.',
        }
    }
  }, [step])


  return (
    <Box sx={styles.wrapper}>
      <Typography
        variant={"h2"}
        sx={styles.title}
      >
        {cardData.stepTitle}
      </Typography>

      <Typography
        variant={'body1'}
        textAlign={"center"}
      >
        {cardData.stepDescription}
      </Typography>
    </Box >
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    boxSizing: 'border-box',
    height: '100%',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px",
    justifyContent: "center"
  } as SxProps<Theme>,
  title: {
    color: "primary.main",
    textAlign: "center"
  } as SxProps<Theme>,
}