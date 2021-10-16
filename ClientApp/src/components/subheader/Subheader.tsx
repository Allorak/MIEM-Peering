import { Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { INewTaskState } from "../../store/types";
import { palette } from "../../theme/colors";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface IProps {
  activeStep: INewTaskState
}

const steps = [
  {
    id: 'author-form',
    title: "Форма для загрузки",
    num: 1
  },
  {
    id: 'peer-form',
    title: "Форма для проверки",
    num: 2
  },
  {
    id: 'settings',
    title: "Правила",
    num: 3
  }
] as Array<{ id: INewTaskState, title: string, num: number }>

export const Subheader: FC<IProps> = ({
  activeStep
}) => {

  return (
    <Box sx={styles.wrapper}>
      {/* authform */}
      <Box sx={activeStep === 'author-form' ? styles.contentContainer : { ...styles.contentContainer, ...styles.contentContainerInvisble }}>
        <Typography variant={'h6'}
          sx={activeStep === 'author-form' ? { ...styles.contentStep, ...styles.contentStepActive } : styles.contentStep}
        >
          {"1"}
        </Typography>

        <Typography variant={'h6'}
          sx={activeStep === 'author-form' ? { ...styles.contentTitle, ...styles.contentTitleActive } : styles.contentTitle}
        >
          {"Форма для загрузки"}
        </Typography>
      </Box>

      <Box sx={styles.contentContainerInvisble}>
        <ArrowForwardIosIcon
          color='primary'
          fontSize='small'
        />
      </Box>

      <Box sx={activeStep === 'peer-form' ? styles.contentContainer : { ...styles.contentContainer, ...styles.contentContainerInvisble }}>
        <Typography variant={'h6'}
          sx={activeStep === 'peer-form' ? { ...styles.contentStep, ...styles.contentStepActive } : styles.contentStep}
        >
          {"2"}
        </Typography>

        <Typography variant={'h6'}
          sx={activeStep === 'peer-form' ? { ...styles.contentTitle, ...styles.contentTitleActive } : styles.contentTitle}
        >
          {"Форма для проверки"}
        </Typography>
      </Box>

      <Box sx={styles.contentContainerInvisble}>
        <ArrowForwardIosIcon
          color='primary'
          fontSize='small'
        />
      </Box>

      <Box sx={activeStep === 'settings' ? styles.contentContainer : { ...styles.contentContainer, ...styles.contentContainerInvisble }}>
        <Typography variant={'h6'}
          sx={activeStep === 'settings' ? { ...styles.contentStep, ...styles.contentStepActive } : styles.contentStep}
        >
          {"3"}
        </Typography>

        <Typography variant={'h6'}
          sx={activeStep === 'settings' ? { ...styles.contentTitle, ...styles.contentTitleActive } : styles.contentTitle}
        >
          {"Правила"}
        </Typography>
      </Box>

      <Box sx={styles.contentContainerInvisble}>
        <ArrowForwardIosIcon
          color='primary'
          fontSize='small'
        />
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '10px',
    '@media (max-width: 700px)': {
      justifyContent: 'flex-end'
    }
  } as SxProps<Theme>,
  contentContainer: {
    display: 'flex-inline',
    gap: '10px'
  } as SxProps<Theme>,
  contentContainerInvisble: {
    '@media (max-width: 700px)': {
      display: 'none',
      opacity: '0',
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px'
    }
  } as SxProps<Theme>,
  contentStep: {
    color: 'common.black',
    fontWeight: '600',
    padding: '0px 20px',
    lineHeight: '20px',
    backgroundColor: '#EFF1F2',
  } as SxProps<Theme>,
  contentStepActive: {
    color: 'common.white',
    backgroundColor: 'primary',
  } as SxProps<Theme>,
  contentTitle: {
    color: palette.fill.grey,
    fontWeight: '400',
    lineHeight: '20px'
  } as SxProps<Theme>,
  contentTitleActive: {
    color: 'common.black',
    fontWeight: '600',
  } as SxProps<Theme>,
}