import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { CheckedFile } from "../icons/CheckedFile";


interface IProps {
  reviewedSubmissions: number
}

export const CheckedSubmissionsCount: FC<IProps> = ({ reviewedSubmissions }) => {

  return (
    <Box sx={styles.wrapper}>
      <Box>
        {typeof reviewedSubmissions === 'number' && (
          <Box sx={styles.cardContent}>
            <Box sx={styles.cardHeader}>
              <Box sx={styles.typeIcon}>
                <CheckedFile />
              </Box>
            </Box>
            <Box sx={styles.cardBody}>
              <Typography variant={'h5'}>
                {reviewedSubmissions}
              </Typography>
              <Typography variant={'body1'}>
                {"Проверено"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
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
    alignItems: "center",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px"
  } as SxProps<Theme>,
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    mr: '24px'
  } as SxProps<Theme>,
  cardBody: {
  } as SxProps<Theme>,
  typeIcon: {
    display: 'flex',
    width: '60px',
    flexShrink: 0
  } as SxProps<Theme>,
  cardContent: {
    display: "flex",
  } as SxProps<Theme>,
}