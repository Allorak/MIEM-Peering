import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { IDeadlines } from "../../store/types"
import { palette } from "../../theme/colors";


export const Deadlines: FC<IDeadlines> = ({
  submissionStartDateTime: sBegin,
  submissionEndDateTime: sEnd,
  reviewStartDateTime: rBegin,
  reviewEndDateTime: rEnd,
}) => {

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.cardsWrapper}>
        {sBegin && typeof sBegin !== 'string' && (
          <Box sx={{ ...styles.dateBox, ...styles.startBox }}>
            <Typography variant={'h6'}>
              {"Период сдачи работ начинается"}
            </Typography>

            <Typography variant={'body1'}>
              {"Дата и время, когда открывается период сдачи"}
            </Typography>

            <Box sx={styles.fieldsContainer}>
              <Typography variant={"h6"}>
                {sBegin.toLocaleDateString()}
              </Typography>

              <Typography variant={"h6"}>
                {sBegin.toLocaleTimeString().split(":", 2).join(":")}
              </Typography>
            </Box>
          </Box>
        )}

        {sEnd && typeof sEnd !== 'string' && (
          <Box sx={{ ...styles.dateBox, ...styles.endBox }}>
            <Typography variant={'h6'}>
              {"Период сдачи работ заканчивается"}
            </Typography>

            <Typography variant={'body1'}>
              {"Дата и время окончания периода сдачи работ"}
            </Typography>

            <Box sx={styles.fieldsContainer}>
              <Typography variant={"h6"}>
                {sEnd.toLocaleDateString()}
              </Typography>

              <Typography variant={"h6"}>
                {sEnd.toLocaleTimeString().split(":", 2).join(":")}
              </Typography>

            </Box>
          </Box>
        )}
      </Box>

      <Box sx={styles.cardsWrapper}>
        {rBegin && typeof rBegin !== 'string' && (
          <Box sx={{ ...styles.dateBox, ...styles.startBox }}>
            <Typography variant={'h6'}>
              {"Период проверки начинается"}
            </Typography>

            <Typography variant={'body1'}>
              {"Дата и время начала периода проверки"}
            </Typography>

            <Box sx={styles.fieldsContainer}>

              <Typography variant={"h6"}>
                {rBegin.toLocaleDateString()}
              </Typography>

              <Typography variant={"h6"}>
                {rBegin.toLocaleTimeString().split(":", 2).join(":")}
              </Typography>
            </Box>
          </Box>
        )}

        {rEnd && typeof rEnd !== 'string' && (
          <Box sx={{ ...styles.dateBox, ...styles.endBox }}>
            <Typography variant={'h6'}>
              {"Период проверки заканчивается"}
            </Typography>

            <Typography variant={'body1'}>
              {"Дата и время закрытия периода проверки"}
            </Typography>

            <Box sx={styles.fieldsContainer}>
              <Typography variant={"h6"}>
                {rEnd.toLocaleDateString()}
              </Typography>
              <Typography variant={"h6"}>
                {rEnd.toLocaleTimeString().split(":", 2).join(":")}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box />
    </Box>
  )
}

const styles = {
  wrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr) )",
    '@media (max-width: 670px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr) )"
    }
  } as SxProps<Theme>,
  dateBox: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
  } as SxProps<Theme>,
  fieldsContainer: {
    display: 'flex',
    justifyContent: "space-between",
    gap: '5px',
    margin: "10px 0px 0px 0px"
  } as SxProps<Theme>,
  startBox: {
    borderTop: `7px solid ${palette.fill.secondary}`
  } as SxProps<Theme>,
  endBox: {
    borderTop: `7px solid ${palette.fill.primary}`
  } as SxProps<Theme>,
  cardsWrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr) )",
    '@media (max-width: 1324px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr) )"
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr) )"
    }
  } as SxProps<Theme>,
}