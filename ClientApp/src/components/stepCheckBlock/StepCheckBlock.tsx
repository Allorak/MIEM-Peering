import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { StepSecond } from "../icons/StepSecond";
import { StepFirst } from "../icons/StepFirst";

import { PeerSteps } from "../../store/types";

interface IProps {
  step: PeerSteps
}

export const StepCheckBlock: FC<IProps> = ({
  step
}) => {
  let stepDescription: string | undefined
  let stepIcon: JSX.Element | undefined

  switch (step) {
    case 'FirstStep':
      stepIcon = <StepFirst />
      stepDescription = 'In this type of peer review the author does not know who the reviewers are. This is the most common form of peer review among science journals.'
      break;
    case 'SecondStep':
      stepIcon = <StepSecond />
      stepDescription = 'In this type of peer review the reviewers dont know the identity of authors, and vice versa. This is the most common form of peer review amongst social science and humanities journals.'
      break;
  }

  return (
    <Box sx={styles.wrapper}>
      <Typography variant={'h6'}>
        {"Текущий этап"}
      </Typography>
      <Box>
        {stepIcon && stepDescription && (
          <Box>
            <Box sx={styles.cardHeader}>
              <Box sx={styles.typeIcon}>
                {stepIcon}
              </Box>
            </Box>
            <Box sx={styles.cardBody}>
              <Box sx={styles.hrBlock}></Box>
              <Typography variant={'body1'}>
                {stepDescription}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
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
    gap: "10px"
  } as SxProps<Theme>,
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    margin: '15px 0 0'
  } as SxProps<Theme>,
  cardBody: {
  } as SxProps<Theme>,
  typeName: {
    overflow: 'hidden',
    display: 'block',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    padding: '0 12px'
  } as SxProps<Theme>,
  typeNameColor: {
    color: theme => theme.palette.primary.main,
    backgroundColor: '#EBECFC',
  } as SxProps<Theme>,
  typeIcon: {
    display: 'flex',
    width: '100px',
    marginBottom: '8px',
    flexShrink: 0
  } as SxProps<Theme>,
  hrBlock: {
    width: '15px',
    height: '1px',
    backgroundColor: '#2DCA8C',
    margin: '0 0 15px'
  } as SxProps<Theme>,
}